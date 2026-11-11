export type Env = 'code' | 'cloud' | 'chat'

export type CatalogGroup = { id: string; name: string; auto: boolean; collapsed: boolean }

export type CatalogSkill = {
  id: string
  short: string
  group: string
  fit: number
  what: string
  env: string[]
  tryIt?: string
  tip?: string
  auth?: string
}

/** What this thread has done, kept to decide when to ask for recommendations. */
export type Activity = {
  userTurns: number
  didWork: boolean
  prompts: string[]
  files: string[]
  tools: string[]
  checks: number
  isChecking: boolean
  lastCheck: { turns: number; files: number; tools: number; words: string[] } | null
  lastError: string | null
}

export type Rec = { id: string; reason: string }

export type Recs = { version: number; items: Rec[] }

export type View = {
  query: string
  expanded: string | null
  dismissed: string[]
  seenVersion: number
  /** Groups the person opened or closed, against each group's default. */
  toggledGroups: string[]
}

/** A skill found on disk that the catalog does not know. */
export type ExtraSkill = { id: string; what: string; source: string }

export type AutoTip = { tryIt: string; tip: string }

/** What this session can actually reach, worked out when it starts. */
export type Here = {
  isCloud: boolean
  listed: string[]
  extras: ExtraSkill[]
  missingLocally: string[]
  serverStatus: Record<string, 'ready' | 'auth' | 'off'>
}

declare module 'claude-code' {
  interface PluginState {
    'skills-panel': {
      activity: Shaped<Activity>
      recs: Shaped<Recs>
      view: Shaped<View>
      here: Shaped<Here | null>
      stars: string[]
      tips: Record<string, AutoTip>
    }
  }
}
