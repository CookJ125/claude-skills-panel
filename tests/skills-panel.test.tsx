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
  mock.env(on, opts.isCloud ? { CLAUDE_CODE_REMOTE: 'true', HOME: '/home/u' } : { USERPROFILE: 'C:\\Users\\u' })
  const commands: CommandInfo[] = opts.isCloud
    ? [{ name: 'code-review', description: 'Review', source: 'builtin' }]
    : [
        { name: 'superpowers:systematic-debugging', description: 'Debug', source: 'plugin', plugin: 'superpowers' },
        { name: 'superpowers:test-driven-development', description: 'TDD', source: 'plugin', plugin: 'superpowers' },
        { name: 'brand-new-skill', description: 'Does a new thing', source: 'user' },
        { name: 'unslop', description: 'Cut AI tells from any writing.', source: 'user' },
        { name: 'other-plugin:thing', description: 'A plugin skill', source: 'plugin', plugin: 'other-plugin' },
        // Synced from claude.ai, which rejects disable-model-invocation, so the description says it instead.
        { name: 'synced-thing', description: 'Does a synced thing. Only use when the user asks for it by name.', source: 'user' },
        { name: 'said-only', description: 'No file found. Only use when the user asks for it by name.', source: 'user' },
      ]
  on('command.list', () => ({ value: commands }))
  on('command.register', () => ({ value: { command: 'skills-panel' } }))
  on('tool.list', () => ({ value: [{ name: 'mcp__plugin_spritecook_spritecook__authenticate', description: '', mcp: true }] }))
  on('session.repo', () => ({ value: null }))
  on('session.cwd', () => ({ value: 'D:/Claude/gemcaster-play' }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('model.complete', (_, e) => {
    asked.push(`${String(e.prompt)}
${JSON.stringify(e.system ?? '')}`)
    const text = String(e.prompt).includes('tryIt') ? '{"brand-new-skill":{"tryIt":"Do the new thing","tip":"Use it often."}}' : opts.answer
    return { value: { isAnswered: true, text, usage: USAGE } }
  })
  // On disk: brand-new-skill only the person can start; other-plugin:thing Claude can start.
  const files: Record<string, string> = {
    'C:/Users/u/.claude/skills/brand-new-skill/SKILL.md': '---\r\nname: brand-new-skill\r\ndisable-model-invocation: true\r\n---\r\nBody',
    'C:/Users/u/.claude/plugins/cache/mkt/other-plugin/1.0.0/skills/thing/SKILL.md': '---\nname: thing\ndescription: A plugin skill\n---\nBody',
    'C:/Users/u/.claude/skills/synced/synced-thing/SKILL.md':
      '---\nname: synced-thing\ndescription: Does a synced thing. Only use when the user asks for it by name.\n---\nBody',
  }
  const dirs: Record<string, { name: string; kind: 'dir'; mtimeMs: number }[]> = {
    'C:/Users/u/.claude/plugins/cache': [{ name: 'mkt', kind: 'dir', mtimeMs: 1 }],
    'C:/Users/u/.claude/plugins/cache/mkt/other-plugin': [{ name: '1.0.0', kind: 'dir', mtimeMs: 1 }],
  }
  const slashed = (path: string) => path.replaceAll('\\', '/') // the engine hands paths over with backslashes on Windows
  on('fs.exists', (_, e) => ({ value: files[slashed(e.path)] !== undefined }))
  on('fs.read', (_, e) => {
    const text = files[slashed(e.path)]
    return text === undefined ? { deny: 'ENOENT' } : { value: text }
  })
  on('fs.list', (_, e) => {
    const entries = dirs[slashed(e.path)]
    return entries === undefined ? { deny: 'ENOENT' } : { value: entries.map(d => ({ ...d, size: 0, isLink: false })) }
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

test('personal skills from ~/.claude/skills get their own "My skills" group; manual-only ones say to type them', async ($, on) => {
  engine(on, { isCloud: false, answer: '[]' })
  await $.session.start({ cwd: 'D:/x', surface: 'desktop', isInteractive: true })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ key: 'g:mine' })).toBeDefined()
    expect(await ui.find({ key: 'all:unslop' })).toBeDefined() // known, hand-written
    expect(await ui.find({ key: 'all:brand-new-skill' })).toBeDefined() // found on disk
    expect(await ui.find({ type: 'Text', text: /type \/unslop/ })).toBeDefined()
    expect(await ui.find({ key: 'all:other-plugin:thing' })).toBeDefined()
    expect(await ui.find({ key: 'all:handoff' })).toBeUndefined() // not installed on this PC
    // Who starts each one: read from the catalog, or from the skill's own SKILL.md.
    expect(await ui.find({ type: 'Text', text: /type \/brand-new-skill/ })).toBeDefined()
    await ui.press({ key: 'all:other-plugin:thing' })
    expect(await ui.find({ type: 'Text', text: /Claude loads it on its own when it fits/ })).toBeDefined()
    await ui.press({ key: 'all:code-review' })
    expect(await ui.find({ type: 'Text', text: /Claude loads it on its own when it fits, or you type \/code-review/ })).toBeDefined()
    await ui.unmount()
  }
})

test('skills whose description says "Only use when the user asks for it by name" are tagged to type', async ($, on) => {
  engine(on, { isCloud: false, answer: '[]' })
  await $.session.start({ cwd: 'D:/x', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /type \/synced-thing/ })).toBeDefined() // read from the synced SKILL.md
  expect(await ui.find({ type: 'Text', text: /type \/said-only/ })).toBeDefined() // no file, so from the listed description
  await ui.unmount()
})

test('Haiku is told which skills only the user can start', async ($, on) => {
  const clock = mock.clock(on)
  const asked = engine(on, { isCloud: false, answer: '[]' })
  await $.session.start({ cwd: 'D:/x', surface: 'desktop', isInteractive: true })
  await turn($, 'tidy the readme', 'Edit')
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'now' })
  await ui.unmount()
  await clock.advance(100)
  const check = asked.find(x => x.includes('Skills (id | what it does)')) ?? ''
  expect(check).toContain('unslop | Cuts AI tells from a piece of writing. | USER-STARTED ONLY')
  expect(check).toContain('Type /<id>')
})
