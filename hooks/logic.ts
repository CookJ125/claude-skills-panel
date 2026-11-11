// Pure rules: when a thread counts as important, when to ask again, and how to read
// Haiku's answer. Kept free of `$` so the tests can run them directly.
import type { Activity, CatalogSkill, ExtraSkill, Rec } from '../types'

export const MIN_TURNS = 3
export const RECHECK_EVERY = 3
export const MAX_CHECKS = 10
export const KEEP_PROMPTS = 8
export const PROMPT_CHARS = 240

/** Tools that change files or run things: using one means the thread did real work. */
export const WORK_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Bash', 'PowerShell'])

export const EMPTY_ACTIVITY: Activity = {
  userTurns: 0,
  didWork: false,
  prompts: [],
  files: [],
  tools: [],
  checks: 0,
  isChecking: false,
  lastCheck: null,
  lastError: null,
}

export const isImportant = (a: Activity) => a.userTurns >= MIN_TURNS && a.didWork

const STOP = new Set(
  'the a an and or but to of in on for with this that it is are be was were i you me my we our can could would should do does did not no yes so if then than as at by from about into what how why when where which just please also now still get got make let there here have has had will its your'.split(' '),
)

/** The distinctive words of the recent prompts, to notice a change of topic. */
export function topicWords(prompts: readonly string[]): string[] {
  const words = new Set<string>()
  for (const p of prompts.slice(-RECHECK_EVERY)) {
    for (const w of p.toLowerCase().match(/[a-z][a-z0-9_-]{2,}/g) ?? []) {
      if (!STOP.has(w)) words.add(w)
    }
  }
  return [...words].slice(0, 60)
}

function overlap(a: readonly string[], b: readonly string[]) {
  if (a.length === 0 && b.length === 0) return 1
  const B = new Set(b)
  const shared = a.filter(w => B.has(w)).length
  return shared / new Set([...a, ...b]).size
}

/** Whether to run a check now. The first check runs as soon as the thread is important. */
export function shouldCheck(a: Activity): boolean {
  if (!isImportant(a) || a.isChecking || a.checks >= MAX_CHECKS) return false
  const last = a.lastCheck
  if (last === null) return true
  if (a.userTurns - last.turns < RECHECK_EVERY) return false
  const newFiles = a.files.length > last.files
  const newTools = a.tools.length > last.tools
  const newTopic = overlap(topicWords(a.prompts), last.words) < 0.3
  return newFiles || newTools || newTopic
}

export const trimPrompt = (text: string) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > PROMPT_CHARS ? flat.slice(0, PROMPT_CHARS) + '…' : flat
}

export const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path

/** A short tool name: `mcp__plugin_x_y__do` becomes `mcp:x_y`. */
export function toolLabel(tool: string) {
  const m = /^mcp__(.+?)__/.exec(tool)
  return m ? `mcp:${(m[1] ?? '').replace(/^plugin_/, '')}` : tool
}

export type Candidate = Pick<CatalogSkill, 'id' | 'what' | 'env'> & { isHere: boolean }

/** The fixed part of the request: instructions and every skill. Cached between checks. */
export function systemText(skills: readonly Candidate[], isCloud: boolean) {
  const lines = skills.map(s => `${s.id} | ${s.what}${s.isHere ? '' : ' | NOT AVAILABLE IN THIS SESSION'}`)
  return [
    'You pick Claude Code skills that would help with the work happening in a coding thread.',
    `The thread runs in ${isCloud ? 'a cloud session (a remote machine with no access to the user\'s PC)' : 'a Code session on the user\'s own PC'}.`,
    'Pick EVERY skill that is clearly relevant, as many as apply, most relevant first. Skip skills that are only loosely related.',
    'Skills marked NOT AVAILABLE still count: recommend them when they fit, and say in the reason what they would add.',
    'Each reason is one short sentence, under 110 characters, tied to what the thread is actually doing. Plain words, no jargon.',
    'Answer with JSON only, no prose: [{"skill":"<exact id>","reason":"<sentence>"}]. Answer [] when nothing fits.',
    '',
    'Skills (id | what it does):',
    ...lines,
  ].join('\n')
}

export function activityText(a: Activity, where: string) {
  return [
    `Working folder: ${where}`,
    `Messages from the user so far: ${a.userTurns}`,
    'Recent user messages (trimmed):',
    ...a.prompts.map(p => `- ${p}`),
    `Files touched: ${a.files.slice(-30).join(', ') || 'none'}`,
    `Tools used: ${a.tools.join(', ') || 'none'}`,
    '',
    'Which skills fit? JSON only.',
  ].join('\n')
}

/** Reads Haiku's answer, keeping only known skills, each once, in the order given. */
export function parseRecs(text: string, known: readonly string[]): Rec[] {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start < 0 || end <= start) return []
  let raw: unknown
  try {
    raw = JSON.parse(text.slice(start, end + 1))
  } catch {
    return []
  }
  if (!Array.isArray(raw)) return []
  const byId = new Map(known.map(id => [id.toLowerCase(), id]))
  const byShort = new Map(known.map(id => [(id.split(':').pop() ?? id).toLowerCase(), id]))
  const seen = new Set<string>()
  const out: Rec[] = []
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue
    const o = item as Record<string, unknown>
    const name = String(o.skill ?? '').replace(/^\//, '').toLowerCase()
    const id = byId.get(name) ?? byShort.get(name.split(':').pop() ?? name)
    if (id === undefined || seen.has(id)) continue
    seen.add(id)
    out.push({ id, reason: String(o.reason ?? '').slice(0, 200) })
  }
  return out
}

/** The prompt that asks Haiku to write tips for skills the catalog does not know. */
export function tipsPrompt(extras: readonly ExtraSkill[]) {
  return [
    'For each Claude Code skill below, write a short example of what a person would type to use it ("tryIt", under 70 characters, written as the person) and one practical tip ("tip", one sentence under 110 characters).',
    'Answer with JSON only: {"<id>": {"tryIt": "...", "tip": "..."}}',
    '',
    ...extras.map(e => `${e.id}: ${e.what}`),
  ].join('\n')
}

export function parseTips(text: string): Record<string, { tryIt: string; tip: string }> {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) return {}
  try {
    const raw = JSON.parse(text.slice(start, end + 1)) as Record<string, { tryIt?: unknown; tip?: unknown }>
    const out: Record<string, { tryIt: string; tip: string }> = {}
    for (const [id, v] of Object.entries(raw)) {
      if (v && typeof v === 'object') out[id] = { tryIt: String(v.tryIt ?? '').slice(0, 120), tip: String(v.tip ?? '').slice(0, 200) }
    }
    return out
  } catch {
    return {}
  }
}
