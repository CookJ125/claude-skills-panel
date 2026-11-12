import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Activity, AutoTip, ExtraSkill, Here, Recs, View } from '../types'
import { CATALOG_UPDATED, GROUPS, SKILLS } from './catalog'
import {
  EMPTY_ACTIVITY,
  KEEP_PROMPTS,
  MAX_CHECKS,
  MIN_TURNS,
  WORK_TOOLS,
  activityText,
  baseName,
  canForce,
  isImportant,
  parseRecs,
  parseTips,
  shouldCheck,
  systemText,
  tipsPrompt,
  toolLabel,
  topicWords,
  trimPrompt,
} from './logic'
import type { Candidate } from './logic'

const PANE = 'skills-panel' // `/skills` is a built-in command
const MODEL = 'haiku'

const activity = atom({ plugin: 'skills-panel', key: 'activity' } as const, EMPTY_ACTIVITY, { shape: 'activity-1' })
const recs = atom({ plugin: 'skills-panel', key: 'recs' } as const, { version: 0, items: [] } as Recs, { shape: 'recs-1' })
const EMPTY_VIEW: View = { query: '', expanded: null, dismissed: [], seenVersion: 0, toggledGroups: [] }
const view = atom({ plugin: 'skills-panel', key: 'view' } as const, EMPTY_VIEW, { shape: 'view-2' })
const here = atom({ plugin: 'skills-panel', key: 'here' } as const, null as Here | null, { shape: 'here-1' })
const stars = atom({ plugin: 'skills-panel', key: 'stars' } as const, [] as string[])
const tips = atom({ plugin: 'skills-panel', key: 'tips' } as const, {} as Record<string, AutoTip>)

/** Which MCP server each connector-backed group depends on, as it appears in tool names. */
const GROUP_SERVER: Record<string, string> = { sc: 'spritecook', ad: 'adobe', ca: 'canva', dc: 'desktop_commander' }
/** Groups whose skills ship with Claude Code itself rather than a plugin installed on the PC. */
const BUILT_IN = new Set(['core', 'an'])

type Avail = 'here' | 'auth' | 'off' | 'pc-only'

type Entry = {
  id: string
  short: string
  group: string
  fit: number
  what: string
  env: string[]
  tryIt?: string
  tip?: string
  isAutoTip: boolean
  avail: Avail
}

// ---------- what this session can reach

async function survey($: EngineInterface): Promise<Here> {
  const isCloud = (await $.env.get('CLAUDE_CODE_REMOTE')) === 'true'
  const commands = await $.command.list()
  const listed = commands.map(c => c.name)
  const known = new Set(SKILLS.flatMap(s => [s.id.toLowerCase(), s.short.toLowerCase()]))
  const extras: ExtraSkill[] = commands
    .filter(c => (c.source === 'plugin' || c.source === 'user') && c.name !== PANE && c.plugin !== 'skills-panel')
    .filter(c => !known.has(c.name.toLowerCase()) && !known.has((c.name.split(':').pop() ?? '').toLowerCase()))
    .map(c => ({ id: c.name, what: c.description, source: c.plugin ?? c.source }))
  const listedSet = new Set(listed.map(n => n.toLowerCase()))
  const missingLocally =
    isCloud || listed.length === 0
      ? []
      : SKILLS.filter(s => !BUILT_IN.has(s.group) && !listedSet.has(s.id.toLowerCase()) && !listedSet.has(s.short.toLowerCase())).map(s => s.id)
  const tools = (await $.tool.list()).map(t => t.name.toLowerCase())
  const serverStatus: Here['serverStatus'] = {}
  for (const server of Object.values(GROUP_SERVER)) {
    const mine = tools.filter(t => t.startsWith('mcp__') && t.includes(server))
    serverStatus[server] = mine.some(t => !t.endsWith('__authenticate')) ? 'ready' : mine.length > 0 ? 'auth' : 'off'
  }
  return { isCloud, listed, extras, missingLocally, serverStatus }
}

function availability(s: { id: string; short: string; group: string; env: string[] }, hn: Here | null): Avail {
  if (hn === null) return 'here'
  const listed = new Set(hn.listed.map(n => n.toLowerCase()))
  const isListed = listed.has(s.id.toLowerCase()) || listed.has(s.short.toLowerCase())
  if (hn.isCloud && !isListed && !(BUILT_IN.has(s.group) && s.env.includes('cloud'))) return 'pc-only'
  const server = GROUP_SERVER[s.group]
  if (server !== undefined) {
    const status = hn.serverStatus[server]
    if (status === 'auth') return 'auth'
    if (status === 'off') return hn.isCloud ? 'pc-only' : 'off'
  }
  return 'here'
}

function entries(hn: Here | null, autoTips: Record<string, AutoTip>): Entry[] {
  const missing = new Set(hn?.missingLocally ?? [])
  const fromCatalog: Entry[] = SKILLS.filter(s => !missing.has(s.id)).map(s => ({
    ...s,
    isAutoTip: false,
    avail: availability(s, hn),
  }))
  const fromDisk: Entry[] = (hn?.extras ?? []).map(x => ({
    id: x.id,
    short: x.id.split(':').pop() ?? x.id,
    group: 'new',
    fit: 0,
    what: x.what,
    env: ['code'],
    tryIt: autoTips[x.id]?.tryIt,
    tip: autoTips[x.id]?.tip,
    isAutoTip: autoTips[x.id] !== undefined,
    avail: 'here' as Avail,
  }))
  return [...fromCatalog, ...fromDisk]
}

// ---------- asking Haiku

/** `isForced` is the panel's "Suggest now" button: it skips the wait for real work. */
async function runCheck($: EngineInterface, isForced = false) {
  const a = await read($, activity)
  if (!(isForced ? canForce(a) : shouldCheck(a))) return
  await update($, activity, x => ({ ...x, isChecking: true }))
  const hn = await read($, here)
  const list = entries(hn, await read($, tips))
  const candidates: Candidate[] = list.map(s => ({ id: s.id, what: s.what, env: s.env, isHere: s.avail === 'here' || s.avail === 'auth' }))
  const where = (await $.session.repo())?.name ?? baseName(await $.session.cwd())
  const reply = await $.model.complete({
    model: MODEL,
    system: [{ text: systemText(candidates, hn?.isCloud ?? false), cache: true }],
    prompt: activityText(a, where),
    maxTokens: 1500,
    timeoutMs: 60_000,
  })
  const snapshot = { turns: a.userTurns, files: a.files.length, tools: a.tools.length, words: topicWords(a.prompts) }
  if (reply.isAnswered) {
    const items = parseRecs(reply.text, list.map(s => s.id))
    await update($, recs, r => ({ version: r.version + 1, items }))
  }
  await update($, activity, x => ({
    ...x,
    isChecking: false,
    checks: x.checks + 1,
    lastCheck: snapshot,
    lastError: reply.isAnswered ? null : reply.reason,
  }))
}

async function writeMissingTips($: EngineInterface) {
  const hn = await read($, here)
  if (hn === null || hn.isCloud) return
  const have = await read($, tips)
  const todo = hn.extras.filter(x => have[x.id] === undefined).slice(0, 25)
  if (todo.length === 0) return
  const reply = await $.model.complete({ model: MODEL, prompt: tipsPrompt(todo), maxTokens: 2000, timeoutMs: 60_000 })
  if (!reply.isAnswered) return
  const fresh = parseTips(reply.text)
  const merged = await update($, tips, t => ({ ...t, ...fresh }))
  await $.store.set('tips', merged)
}

async function refreshHere($: EngineInterface) {
  const hn = await survey($)
  await update($, here, () => hn)
}

async function openPane($: EngineInterface) {
  await refreshHere($)
  const r = await read($, recs)
  await update($, view, v => ({ ...v, seenVersion: r.version }))
  return $.ui.open({ id: PANE, title: 'Skills' })
}

function updatePrompt(hn: Here) {
  const added = hn.extras.map(x => `- ${x.id} (from ${x.source}): ${x.what}`)
  return [
    'Update the cloud skill list of the skills-panel mod (GitHub repo CookJ125/claude-skills-panel, file hooks/catalog.ts).',
    added.length ? `Add these skills, with group "new", fit 0, env ["code"], and the "what" text below:\n${added.join('\n')}` : '',
    hn.missingLocally.length ? `Remove these skills, which are no longer installed: ${hn.missingLocally.join(', ')}` : '',
    'Set CATALOG_UPDATED to today, bump the patch version in .claude-plugin/plugin.json, commit, push, then run `claude plugin update skills-panel`.',
  ]
    .filter(Boolean)
    .join('\n\n')
}

// ---------- the module

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    try {
      await $.command.register({ name: PANE, description: 'Open the skills panel: every skill, with suggestions for this thread' })
    } catch (err) {
      $.ui.log(`skills-panel: could not add /${PANE}: ${String(err)}`) // the rest of the mod still runs
    }
    const saved = (await $.store.get('stars')) as string[] | undefined
    if (Array.isArray(saved)) await update($, stars, () => saved)
    const savedTips = (await $.store.get('tips')) as Record<string, AutoTip> | undefined
    if (savedTips && typeof savedTips === 'object') await update($, tips, () => savedTips)
    await refreshHere($)
    $.clock.after(5_000, () => void writeMissingTips($))
    return next(e)
  })

  on('command.run', { command: PANE }, async $ => {
    await openPane($)
    return { text: 'Skills panel opened.' }
  }).catch(() => ({ text: 'The skills panel could not open. Check the debug log for skills-panel.' }))

  on('prompt.submit', async ($, e, next) => {
    if (e.command === undefined && e.isMeta !== true && e.text.trim() !== '') {
      const line = trimPrompt(e.text)
      await update($, activity, a => ({
        ...a,
        userTurns: a.userTurns + 1,
        prompts: [...a.prompts, line].slice(-KEEP_PROMPTS),
      }))
    }
    return next(e)
  }).catch(($, e, next) => next(e)) // only watches: a failure here never holds a prompt back

  on('tool.call', async ($, e, next) => {
    const tool = String(e.tool)
    const args = e as unknown as Record<string, unknown>
    const path = args.file_path ?? args.notebook_path ?? args.path
    const label = toolLabel(tool)
    await update($, activity, a => {
      const file = typeof path === 'string' ? baseName(path) : null
      return {
        ...a,
        didWork: a.didWork || WORK_TOOLS.has(tool),
        files: file && !a.files.includes(file) ? [...a.files, file].slice(-60) : a.files,
        tools: a.tools.includes(label) ? a.tools : [...a.tools, label],
      }
    })
    return next(e)
  }).catch(($, e, next) => next(e)) // only watches: a failure here never blocks a tool

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    const loop = (e as { agentId?: string }).agentId
    if (loop === undefined && shouldCheck(await read($, activity))) {
      $.clock.after(50, () => void runCheck($))
    }
    return done
  })

  // ---------- the hint above the prompt

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const r = await read($, recs)
    const v = await read($, view)
    const hn = await read($, here)
    const visible = r.items.filter(i => !v.dismissed.includes(i.id))
    if (e.props.hasSurvey || visible.length === 0 || r.version <= v.seenVersion) return next(e)
    const list = entries(hn, await read($, tips))
    const pcOnly = visible.filter(i => list.find(s => s.id === i.id)?.avail === 'pc-only').length
    const names = visible.slice(0, 3).map(i => i.id.split(':').pop()).join(', ')
    const { Box, Button, Text } = $.ui.resolve(e)
    return (
      <Box flexDirection="row" gap={1}>
        <Text wrap="truncate-end">
          <Text color="suggestion">
            {visible.length} skill{visible.length === 1 ? '' : 's'} suggested
          </Text>
          <Text dimColor>
            : {names}
            {visible.length > 3 ? '…' : ''}
          </Text>
          {pcOnly > 0 && <Text color="warning"> · {pcOnly} need a PC session</Text>}
        </Text>
        <Button key="show" label="Show" variant="primary" onPress={() => void openPane($)} />
        <Button key="hide" label="Hide" role="dismiss" onPress={() => update($, view, x => ({ ...x, seenVersion: r.version }))} />
      </Box>
    )
  })

  // ---------- the panel

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Input, Text } = $.ui.resolve(e)
    const a = await read($, activity)
    const r = await read($, recs)
    const v = await read($, view)
    const hn = await read($, here)
    const starred = await read($, stars)
    const list = entries(hn, await read($, tips))
    const byId = new Map(list.map(s => [s.id, s]))
    const q = v.query.trim().toLowerCase()

    const toggle = (id: string) => update($, view, x => ({ ...x, expanded: x.expanded === id ? null : id }))
    const toggleStar = async (id: string) => {
      const next = await update($, stars, s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]))
      await $.store.set('stars', next)
    }
    const dismiss = (id: string) => update($, view, x => ({ ...x, dismissed: [...x.dismissed, id], expanded: x.expanded === id ? null : x.expanded }))
    const toggleGroup = (id: string) =>
      update($, view, x => ({ ...x, toggledGroups: x.toggledGroups.includes(id) ? x.toggledGroups.filter(g => g !== id) : [...x.toggledGroups, id] }))

    const envStrip = (s: Entry) => (
      <Text>
        {(['code', 'cloud', 'chat'] as const).map(k =>
          s.env.includes(k) ? (
            <Text color="success" weight="semibold">
              {k.toUpperCase()}{' '}
            </Text>
          ) : (
            <Text dimColor strikethrough>
              {k.toUpperCase()}
            </Text>
          ),
        )}
      </Text>
    )

    const tags = (s: Entry) => {
      const out: { text: string; color: 'warning' | 'error' | 'suggestion' | 'subtle' }[] = []
      if (s.avail === 'pc-only') out.push({ text: 'PC only', color: 'warning' })
      if (s.avail === 'auth') out.push({ text: 'Sign-in needed', color: 'warning' })
      if (s.avail === 'off') out.push({ text: 'Not connected', color: 'error' })
      if (GROUPS.find(g => g.id === s.group)?.auto) out.push({ text: 'Auto', color: 'subtle' })
      if (s.fit === 2) out.push({ text: 'fits your work', color: 'suggestion' })
      return out
    }

    const row = (s: Entry, prefix: string) => (
      <Button key={`${prefix}:${s.id}`} plain dimColor={s.avail === 'pc-only'} onPress={() => toggle(s.id)}>
        {starred.includes(s.id) ? '★ ' : ''}
        {s.short}
        {tags(s).map(t => (
          <Text color={t.color}> · {t.text}</Text>
        ))}
      </Button>
    )

    const details = (s: Entry) => (
      <Box flexDirection="column" paddingLeft={2} paddingBottom={1}>
        <Text>{s.what}</Text>
        {s.tryIt && (
          <Text>
            <Text color="suggestion">Try: </Text>
            {s.tryIt}
          </Text>
        )}
        {s.tip && <Text dimColor>Tip: {s.tip}</Text>}
        {s.isAutoTip && <Text dimColor italic>Try and tip auto-written by Haiku.</Text>}
        {s.avail === 'auth' && <Text color="warning">Sign in first: run /mcp from a claude terminal.</Text>}
        {s.avail === 'off' && <Text color="error">Its connector isn't connected in this session.</Text>}
        {s.avail === 'pc-only' && <Text color="warning">Not installed in this cloud session. Move the task to a Code session on your PC to use it.</Text>}
        <Box flexDirection="row" gap={1}>
          <Text dimColor>Works in:</Text>
          {envStrip(s)}
        </Box>
        <Box flexDirection="row" gap={1}>
          {s.avail !== 'pc-only' && (
            <Button key={`fill:${s.id}`} label={`Put /${s.id} in prompt`} onPress={() => void $.prompt.fill({ text: `/${s.id} `, mode: 'insert' })} />
          )}
          <Button key={`star:${s.id}`} label={starred.includes(s.id) ? 'Unstar' : 'Star'} onPress={() => void toggleStar(s.id)} />
        </Box>
      </Box>
    )

    const item = (s: Entry, prefix: string) => (
      <Box flexDirection="column">
        {row(s, prefix)}
        {v.expanded === s.id && details(s)}
      </Box>
    )

    // Suggested section
    const suggested = r.items.filter(i => !v.dismissed.includes(i.id) && byId.has(i.id))
    const status = !isImportant(a) ? (
      <Text dimColor>
        Suggestions start once this thread does real work: {MIN_TURNS} messages plus a file edit or command. So far: {a.userTurns}{' '}
        message{a.userTurns === 1 ? '' : 's'}, {a.didWork ? 'work done' : 'no work yet'}.
      </Text>
    ) : a.isChecking ? (
      <Text color="suggestion">Asking Haiku which skills fit this thread…</Text>
    ) : a.lastError ? (
      <Text color="warning">Last check failed ({a.lastError}). It tries again when the work shifts.</Text>
    ) : a.checks >= MAX_CHECKS ? (
      <Text dimColor>All {MAX_CHECKS} checks for this thread are used.</Text>
    ) : (
      <Text dimColor>
        {a.checks} of {MAX_CHECKS} checks used. Next check after 3 more messages, if the work has shifted.
      </Text>
    )

    const groupOpen = (id: string, collapsedByDefault: boolean) => collapsedByDefault !== v.toggledGroups.includes(id)

    const allGroups = [...GROUPS, { id: 'new', name: 'Newly found', auto: false, collapsed: false }]

    return (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text weight="bold" size="heading">
            Skills
          </Text>
          <Text dimColor>
            {list.filter(s => s.avail !== 'pc-only').length} work here · {hn?.isCloud ? 'cloud session' : 'PC session'}
          </Text>
        </Box>
        <Input key="q" placeholder="Search skills" value={v.query} onInput={t => void update($, view, x => ({ ...x, query: t }))} onSubmit={t => void update($, view, x => ({ ...x, query: t }))} />

        {q === '' && (
          <Box flexDirection="column">
            <Text weight="semibold">Suggested for this thread</Text>
            {status}
            {canForce(a) && <Button key="now" label="Suggest now" onPress={() => void runCheck($, true)} />}
            {suggested.map(i => {
              const s = byId.get(i.id) as Entry
              return (
                <Box flexDirection="column" paddingTop={1}>
                  {row(s, 'sug')}
                  <Box flexDirection="column" paddingLeft={2}>
                    {i.reason !== '' && <Text dimColor>{i.reason}</Text>}
                    {s.avail === 'pc-only' && <Text color="warning">Move to a PC session to use this.</Text>}
                    <Box flexDirection="row" gap={1}>
                      <Button key={`more:${s.id}`} label={v.expanded === s.id ? 'Less' : 'More'} dimColor onPress={() => toggle(s.id)} />
                      <Button key={`dis:${s.id}`} label="Dismiss" dimColor onPress={() => dismiss(s.id)} />
                    </Box>
                  </Box>
                  {v.expanded === s.id && details(s)}
                </Box>
              )
            })}
          </Box>
        )}

        {q !== '' ? (
          <Box flexDirection="column">
            {(() => {
              const hits = list.filter(s => `${s.id} ${s.what} ${s.tryIt ?? ''} ${s.tip ?? ''}`.toLowerCase().includes(q))
              return [
                <Text weight="semibold">Matches ({hits.length})</Text>,
                ...hits.map(s => item(s, 'hit')),
                ...(hits.length === 0 ? [<Text dimColor>No skills match. Clear the search to see them all.</Text>] : []),
              ]
            })()}
          </Box>
        ) : (
          <Box flexDirection="column" gap={1}>
            {starred.length > 0 && (
              <Box flexDirection="column">
                <Text weight="semibold">Starred</Text>
                {starred.filter(id => byId.has(id)).map(id => item(byId.get(id) as Entry, 'star'))}
              </Box>
            )}
            {allGroups.map(g => {
              const members = list
                .filter(s => s.group === g.id)
                .sort((x, y) => Number(x.avail === 'pc-only') - Number(y.avail === 'pc-only') || y.fit - x.fit)
              if (members.length === 0) return null
              const isOpen = groupOpen(g.id, !g.collapsed)
              return (
                <Box flexDirection="column">
                  <Button key={`g:${g.id}`} plain onPress={() => toggleGroup(g.id)}>
                    {isOpen ? '▾ ' : '▸ '}
                    <Text weight="semibold">{g.name}</Text>
                    <Text dimColor> ({members.length})</Text>
                  </Button>
                  {isOpen && members.map(s => item(s, 'all'))}
                </Box>
              )
            })}
          </Box>
        )}

        {hn !== null && !hn.isCloud && (hn.extras.length > 0 || hn.missingLocally.length > 0) && (
          <Box flexDirection="column">
            <Text color="warning">
              Cloud list out of date: {hn.extras.length} new, {hn.missingLocally.length} removed since {CATALOG_UPDATED}.
            </Text>
            <Button key="upd" label="Update cloud list" onPress={() => void $.prompt.submit({ text: updatePrompt(hn) })} />
          </Box>
        )}
      </Box>
    )
  })
}
