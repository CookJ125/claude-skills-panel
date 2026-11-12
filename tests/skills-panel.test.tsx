import { expect, mock, test } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { CommandInfo, On } from 'claude-code'

const PANE = {
  plugin: 'skills-panel',
  component: 'Pane',
  requestId: 'skills-panel',
  props: { title: 'Skills', isFocused: false, bodyColumns: 60, placement: 'dock', scroll: { offset: 0, bodyRows: 200 }, view: {} },
} as const

const BAND = {
  plugin: 'skills-panel',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 3, bodyColumns: 80, scroll: { offset: 0, bodyRows: 3 }, view: {} },
} as const

const USAGE = { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }

/** The engine beneath the mod: a PC session with Superpowers installed, or a cloud one without. */
function engine(on: On, opts: { isCloud: boolean; answer: string }) {
  const asked: string[] = []
  mock.store(on)
  mock.env(on, opts.isCloud ? { CLAUDE_CODE_REMOTE: 'true' } : {})
  const commands: CommandInfo[] = opts.isCloud
    ? [{ name: 'code-review', description: 'Review', source: 'builtin' }]
    : [
        { name: 'superpowers:systematic-debugging', description: 'Debug', source: 'plugin', plugin: 'superpowers' },
        { name: 'superpowers:test-driven-development', description: 'TDD', source: 'plugin', plugin: 'superpowers' },
        { name: 'brand-new-skill', description: 'Does a new thing', source: 'user' },
      ]
  on('command.list', () => ({ value: commands }))
  on('command.register', () => ({ value: { command: 'skills-panel' } }))
  on('tool.list', () => ({ value: [{ name: 'mcp__plugin_spritecook_spritecook__authenticate', description: '', mcp: true }] }))
  on('session.repo', () => ({ value: null }))
  on('session.cwd', () => ({ value: 'D:/Claude/gemcaster-play' }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('model.complete', (_, e) => {
    asked.push(String(e.prompt))
    const text = String(e.prompt).includes('tryIt') ? '{"brand-new-skill":{"tryIt":"Do the new thing","tip":"Use it often."}}' : opts.answer
    return { value: { isAnswered: true, text, usage: USAGE } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('prompt.submit', (_, e) => ({ text: e.text }))
  on('tool.call', () => ({ result: {} }))
  on('turn.complete', () => ({ text: '' }))
  return asked
}

async function turn($: Parameters<TestBody>[0], text: string, tool?: string) {
  await $.prompt.submit({ text, wait: false } as never)
  if (tool !== undefined) await $.tool.call({ tool, file_path: 'D:/Claude/gemcaster-play/tether.gd', old_string: 'a', new_string: 'b' } as never)
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't', reason: 'answer' } as never)
}

const ANSWER = JSON.stringify([
  { skill: 'superpowers:systematic-debugging', reason: 'The tether bug survived two fixes.' },
  { skill: 'run', reason: 'Watch the game while it runs.' },
  { skill: 'not-a-real-skill', reason: 'dropped' },
])

test('no check until 3 messages and real work; then Haiku picks are shown first', async ($, on) => {
  const clock = mock.clock(on)
  const asked = engine(on, { isCloud: false, answer: ANSWER })
  await $.session.start({ cwd: 'D:/Claude/gemcaster-play', surface: 'desktop', isInteractive: true })

  await turn($, 'what does the tether do?')
  await turn($, 'and the camera?')
  await turn($, 'ok thanks') // 3 messages, but no file edits or commands yet
  await clock.advance(100)
  expect(asked.filter(p => p.includes('Which skills fit')).length).toBe(0)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /Suggestions start once/ })).toBeDefined()
    await ui.unmount()
  }

  await turn($, 'fix the tether jitter', 'Edit')
  await clock.advance(100)
  const checks = asked.filter(p => p.includes('Which skills fit'))
  expect(checks.length).toBe(1)
  expect(checks[0]).toContain('tether.gd')

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /The tether bug survived two fixes/ })).toBeDefined()
    expect(await ui.find({ key: 'sug:superpowers:systematic-debugging' })).toBeDefined()
    expect(await ui.find({ key: 'sug:not-a-real-skill' })).toBeUndefined()
    await ui.unmount()
  }

  // The hint above the prompt shows until the panel is opened.
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: /2 skills suggested/ })).toBeDefined()
  await band.press({ key: 'show' })
  await band.unmount()
  const after = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await after.find({ type: 'Text', text: /suggested/ })).toBeUndefined()
  await after.unmount()
})

test('a re-check waits for 3 more messages and new work', async ($, on) => {
  const clock = mock.clock(on)
  const asked = engine(on, { isCloud: false, answer: ANSWER })
  await $.session.start({ cwd: 'D:/x', surface: 'desktop', isInteractive: true })
  await turn($, 'one', 'Bash')
  await turn($, 'two')
  await turn($, 'three')
  await clock.advance(100)
  await turn($, 'three again') // only 1 more message
  await clock.advance(100)
  const count = () => asked.filter(p => p.includes('Which skills fit')).length
  expect(count()).toBe(1)
  await turn($, 'four')
  await turn($, 'now edit the shader', 'Write') // 3 more messages and a new tool
  await clock.advance(100)
  expect(count()).toBe(2)
})

test('"Suggest now" asks Haiku right away in a new thread, and counts as a check', async ($, on) => {
  const asked = engine(on, { isCloud: false, answer: ANSWER })
  await $.session.start({ cwd: 'D:/x', surface: 'desktop', isInteractive: true })
  const count = () => asked.filter(p => p.includes('Which skills fit')).length

  const empty = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await empty.find({ key: 'now' })).toBeUndefined() // nothing to go on yet
  await empty.unmount()

  await turn($, 'the tether jitters when the wizard turns')
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    await ui.press({ key: 'now' })
    expect(await ui.find({ key: 'sug:superpowers:systematic-debugging' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /The tether bug survived two fixes/ })).toBeDefined()
    await ui.unmount()
  }
  expect(count()).toBe(2)
  expect(asked.find(p => p.includes('Which skills fit'))).toContain('tether jitters')
})

test('in a cloud session, PC-only skills are faded and still recommended with a move hint', async ($, on) => {
  const clock = mock.clock(on)
  engine(on, { isCloud: true, answer: ANSWER })
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await turn($, 'one', 'Bash')
  await turn($, 'two')
  await turn($, 'three')
  await clock.advance(100)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /Move to a PC session/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /PC only/ })).toBeDefined()
    expect(await ui.find({ key: 'upd' })).toBeUndefined()
    await ui.unmount()
  }
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: /1 need a PC session/ })).toBeDefined()
  await band.unmount()
})

test('on the PC, a new skill gets auto-written tips and the cloud list shows as out of date', async ($, on) => {
  const clock = mock.clock(on)
  engine(on, { isCloud: false, answer: '[]' })
  await $.session.start({ cwd: 'D:/x', surface: 'desktop', isInteractive: true })
  await clock.advance(6_000)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ key: 'upd' })).toBeDefined()
  await ui.input({ key: 'q', text: 'brand-new', kind: 'change' })
  await ui.press({ key: 'hit:brand-new-skill' })
  expect(await ui.find({ type: 'Text', text: /Do the new thing/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /auto-written by Haiku/ })).toBeDefined()
  await ui.press({ key: 'star:brand-new-skill' })
  await ui.unmount()
})
