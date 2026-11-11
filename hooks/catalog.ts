// The skill catalog: every skill known when this file was last updated, with hand-written
// notes from Skill Atlas. Cloud sessions use it to list skills that exist only on the PC.
// Regenerate from a PC session with the panel's "Update cloud list" button.
import type { CatalogGroup, CatalogSkill } from '../types'

export const CATALOG_UPDATED = '2026-11-10'

export const GROUPS: readonly CatalogGroup[] = [
  {
    "id": "core",
    "name": "Claude Code built-ins",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "sp",
    "name": "Superpowers",
    "auto": true,
    "collapsed": false
  },
  {
    "id": "an",
    "name": "Anthropic skills",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "dev",
    "name": "Design and project helpers",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "sc",
    "name": "SpriteCook",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "ad",
    "name": "Adobe for creativity",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "ca",
    "name": "Canva",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "dc",
    "name": "Desktop Commander",
    "auto": false,
    "collapsed": false
  },
  {
    "id": "un",
    "name": "Unity",
    "auto": false,
    "collapsed": true
  }
]

export const SKILLS: readonly CatalogSkill[] = [
 {
  "id": "code-review",
  "short": "code-review",
  "group": "core",
  "fit": 2,
  "what": "Reviews your current changes, a branch or a PR for real bugs. Effort levels go from low (few, sure findings) to max.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/code-review high on my perf branch",
  "tip": "Add --fix to apply the findings, or --comment to post them on the PR. ultra runs a paid multi-agent cloud review."
 },
 {
  "id": "simplify",
  "short": "simplify",
  "group": "core",
  "fit": 2,
  "what": "Cleans up changed code: reuse, simpler logic, efficiency. It doesn't hunt for bugs.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/simplify after finishing the sandbox mob work",
  "tip": "Pairs well with your tidy-code preference. Run it before opening a PR."
 },
 {
  "id": "security-review",
  "short": "security-review",
  "group": "core",
  "fit": 0,
  "what": "Security-focused review of pending changes.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/security-review before I push the save-file loader"
 },
 {
  "id": "run",
  "short": "run",
  "group": "core",
  "fit": 2,
  "what": "Launches the project and drives it so Claude can see a change working, not just pass tests.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/run and check the wind ghost indicator shows up",
  "tip": "For Godot it follows your test rules: audio off, stop only its own processes."
 },
 {
  "id": "init",
  "short": "init",
  "group": "core",
  "fit": 1,
  "what": "Writes a CLAUDE.md for a repo so later sessions know its layout and commands.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/init in gemcaster-play",
  "tip": "Re-run when the project structure changes a lot."
 },
 {
  "id": "loop",
  "short": "loop",
  "group": "core",
  "fit": 1,
  "what": "Repeats a prompt on an interval, or lets Claude pace itself.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/loop 10m check whether the Blender render finished"
 },
 {
  "id": "schedule",
  "short": "schedule",
  "group": "core",
  "fit": 1,
  "what": "Sets up cloud agents that run on a cron schedule, or once at a set time.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Schedule a weekly check that main still builds"
 },
 {
  "id": "update-config",
  "short": "update-config",
  "group": "core",
  "fit": 1,
  "what": "Edits Claude Code settings.json: permissions, env vars, hooks for \"whenever X, do Y\" rules.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Allow godot --headless commands without asking",
  "tip": "Anything automatic (\"every time\", \"before\", \"after\") needs a hook, which this skill writes."
 },
 {
  "id": "fewer-permission-prompts",
  "short": "fewer-permission-prompts",
  "group": "core",
  "fit": 1,
  "what": "Scans your past sessions for safe commands you approve often and adds them to an allowlist.",
  "env": [
   "code"
  ],
  "tryIt": "/fewer-permission-prompts"
 },
 {
  "id": "keybindings-help",
  "short": "keybindings-help",
  "group": "core",
  "fit": 0,
  "what": "Customizes Claude Code keyboard shortcuts.",
  "env": [
   "code"
  ],
  "tryIt": "Rebind submit to ctrl+enter"
 },
 {
  "id": "claude-api",
  "short": "claude-api",
  "group": "core",
  "fit": 0,
  "what": "Reference for building apps on the Claude API: model IDs, pricing, tool use, caching.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Add a Claude-powered hint system to my tool"
 },
 {
  "id": "dataviz",
  "short": "dataviz",
  "group": "core",
  "fit": 2,
  "what": "Rules for clean, accessible charts in any medium, with a tested palette.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Chart frame times from the perf harness",
  "tip": "Loads automatically before Claude draws any chart."
 },
 {
  "id": "artifact-design",
  "short": "artifact-design",
  "group": "core",
  "fit": 1,
  "what": "Design rules for published pages like this one.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Make an explainer page for the tower element system",
  "tip": "Loads automatically when Claude builds an artifact."
 },
 {
  "id": "artifact-diagramming",
  "short": "artifact-diagramming",
  "group": "core",
  "fit": 1,
  "what": "How to draw clear diagrams that show the real mechanism.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Diagram the Gemcaster damage pipeline"
 },
 {
  "id": "artifact-capabilities",
  "short": "artifact-capabilities",
  "group": "core",
  "fit": 1,
  "what": "Lets a published page keep shared data, know who's viewing, or ask Claude questions.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Make a bug tracker page my playtesters can add to",
  "tip": "Use this when a page has to remember things for more than one person."
 },
 {
  "id": "workflow-authoring",
  "short": "workflow-authoring",
  "group": "core",
  "fit": 0,
  "what": "Writes scripts that run many subagents in a fixed pattern. Only runs when you opt in.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Use a workflow to review every spell script",
  "tip": "Costly. Say \"use a workflow\" to opt in."
 },
 {
  "id": "plugin-authoring",
  "short": "plugin-authoring",
  "group": "core",
  "fit": 1,
  "what": "Builds mods for Claude itself: side panels, status lines, slash commands, tool hooks.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Make a status line that shows the current Godot branch"
 },
 {
  "id": "superpowers:using-superpowers",
  "short": "using-superpowers",
  "group": "sp",
  "fit": 1,
  "what": "The router that checks which other Superpowers skill applies. It loads at session start.",
  "env": [
   "code"
  ],
  "tryIt": "(automatic)"
 },
 {
  "id": "superpowers:brainstorming",
  "short": "brainstorming",
  "group": "sp",
  "fit": 2,
  "what": "Asks questions and refines an idea into a design before any code is written.",
  "env": [
   "code"
  ],
  "tryIt": "Let's design a new frost tower",
  "tip": "Fits your rule against invented mechanics: it asks instead of guessing."
 },
 {
  "id": "superpowers:writing-plans",
  "short": "writing-plans",
  "group": "sp",
  "fit": 2,
  "what": "Turns a spec into a step-by-step implementation plan with small, testable tasks.",
  "env": [
   "code"
  ],
  "tryIt": "Write a plan for the codebase health step 3"
 },
 {
  "id": "superpowers:executing-plans",
  "short": "executing-plans",
  "group": "sp",
  "fit": 1,
  "what": "Works through a written plan in this session, with checkpoints.",
  "env": [
   "code"
  ],
  "tryIt": "Execute the plan in docs/plan.md"
 },
 {
  "id": "superpowers:subagent-driven-development",
  "short": "subagent-driven-development",
  "group": "sp",
  "fit": 1,
  "what": "Hands each plan task to a fresh subagent, with a review between tasks.",
  "env": [
   "code"
  ],
  "tryIt": "Run the plan with subagents"
 },
 {
  "id": "superpowers:dispatching-parallel-agents",
  "short": "dispatching-parallel-agents",
  "group": "sp",
  "fit": 1,
  "what": "Splits two or more independent tasks across parallel agents.",
  "env": [
   "code"
  ],
  "tryIt": "Fix these three unrelated test failures at once"
 },
 {
  "id": "superpowers:systematic-debugging",
  "short": "systematic-debugging",
  "group": "sp",
  "fit": 2,
  "what": "Finds the root cause before proposing any fix: reproduce, trace, hypothesize, test.",
  "env": [
   "code"
  ],
  "tryIt": "The tether line jitters when the camera zooms",
  "tip": "Most useful when a bug has survived one quick fix."
 },
 {
  "id": "superpowers:test-driven-development",
  "short": "test-driven-development",
  "group": "sp",
  "fit": 2,
  "what": "Writes the failing test first, then the code that makes it pass.",
  "env": [
   "code"
  ],
  "tryIt": "Add mana regen with TDD"
 },
 {
  "id": "superpowers:verification-before-completion",
  "short": "verification-before-completion",
  "group": "sp",
  "fit": 2,
  "what": "Requires real command output before Claude claims anything is fixed or passing.",
  "env": [
   "code"
  ],
  "tryIt": "(automatic before \"done\")",
  "tip": "This is why Claude shows test output rather than just saying it passed."
 },
 {
  "id": "superpowers:requesting-code-review",
  "short": "requesting-code-review",
  "group": "sp",
  "fit": 2,
  "what": "Sends finished work to a reviewer subagent against the original requirements.",
  "env": [
   "code"
  ],
  "tryIt": "Review this before I merge"
 },
 {
  "id": "superpowers:receiving-code-review",
  "short": "receiving-code-review",
  "group": "sp",
  "fit": 1,
  "what": "Checks review feedback on its merits before changing code.",
  "env": [
   "code"
  ],
  "tryIt": "Address the PR comments"
 },
 {
  "id": "superpowers:using-git-worktrees",
  "short": "using-git-worktrees",
  "group": "sp",
  "fit": 2,
  "what": "Gives feature work its own folder and branch so main stays clean.",
  "env": [
   "code"
  ],
  "tryIt": "Start the indicators work in a worktree",
  "tip": "Good GitHub practice to pick up: one branch per feature."
 },
 {
  "id": "superpowers:finishing-a-development-branch",
  "short": "finishing-a-development-branch",
  "group": "sp",
  "fit": 2,
  "what": "When work is done, offers the options: merge, open a PR, keep it, or discard it.",
  "env": [
   "code"
  ],
  "tryIt": "I'm done with this branch"
 },
 {
  "id": "superpowers:writing-skills",
  "short": "writing-skills",
  "group": "sp",
  "fit": 1,
  "what": "Writes new skills and tests that they actually trigger.",
  "env": [
   "code"
  ],
  "tryIt": "Turn my sandbox mob checklist into a skill"
 },
 {
  "id": "superpowers:diagnosing-superpowers",
  "short": "diagnosing-superpowers",
  "group": "sp",
  "fit": 0,
  "what": "Explains why a Superpowers session went wrong and builds a bug report.",
  "env": [
   "code"
  ],
  "tryIt": "Why did that session take so long?"
 },
 {
  "id": "anthropic-skills:deep-research",
  "short": "deep-research",
  "group": "an",
  "fit": 2,
  "what": "Researches across many sources with subagents, then writes a sourced report.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Research how tower defense games balance elemental resistances",
  "tip": "Used for the Factorio vs Satisfactory study."
 },
 {
  "id": "anthropic-skills:learn",
  "short": "learn",
  "group": "an",
  "fit": 1,
  "what": "Teaching mode: explanations, walk-throughs, quizzes, flashcards.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Teach me git rebase vs merge, then quiz me",
  "tip": "Good for your GitHub learning."
 },
 {
  "id": "anthropic-skills:consolidate-memory",
  "short": "consolidate-memory",
  "group": "an",
  "fit": 2,
  "what": "Merges duplicate memories, fixes stale facts and trims the memory index.",
  "env": [
   "code"
  ],
  "tryIt": "/consolidate-memory",
  "tip": "Worth running every few weeks; your memory index has grown."
 },
 {
  "id": "anthropic-skills:explain-usage",
  "short": "explain-usage",
  "group": "an",
  "fit": 1,
  "what": "Shows where this session's tokens went, with one simple chart.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "Where did my tokens go?"
 },
 {
  "id": "anthropic-skills:built-in-browser",
  "short": "built-in-browser",
  "group": "an",
  "fit": 1,
  "what": "Rules for the browser pane inside this app: tabs, sign-ins, reading pages.",
  "env": [
   "code"
  ],
  "tryIt": "Open the Godot docs page for TileMapLayer"
 },
 {
  "id": "anthropic-skills:chrome-browser",
  "short": "chrome-browser",
  "group": "an",
  "fit": 1,
  "what": "Drives your real Chrome through the extension, with your own sign-ins.",
  "env": [
   "code"
  ],
  "tryIt": "Use Chrome to check my itch.io page"
 },
 {
  "id": "anthropic-skills:computer-use",
  "short": "computer-use",
  "group": "an",
  "fit": 1,
  "what": "Clicks and types in desktop apps by taking screenshots.",
  "env": [
   "code"
  ],
  "tryIt": "Open the Godot editor and screenshot the scene tree",
  "tip": "Slower than code tools. Use it when there's no other way in."
 },
 {
  "id": "anthropic-skills:docs",
  "short": "docs",
  "group": "an",
  "fit": 1,
  "what": "Makes editable claude.ai docs that export to Word, PDF or Markdown.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Write a design doc for the gem fusion system"
 },
 {
  "id": "anthropic-skills:docx",
  "short": "docx",
  "group": "an",
  "fit": 0,
  "what": "Creates or edits Word .docx files.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Make this a .docx"
 },
 {
  "id": "anthropic-skills:xlsx",
  "short": "xlsx",
  "group": "an",
  "fit": 1,
  "what": "Creates or edits spreadsheets, with formulas and formatting.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Put the mob stats into a spreadsheet"
 },
 {
  "id": "anthropic-skills:pptx",
  "short": "pptx",
  "group": "an",
  "fit": 0,
  "what": "Creates or edits PowerPoint files.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Make a .pptx pitch deck"
 },
 {
  "id": "anthropic-skills:pdf",
  "short": "pdf",
  "group": "an",
  "fit": 0,
  "what": "Reads, merges, splits, fills and creates PDFs.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Merge these two PDFs"
 },
 {
  "id": "anthropic-skills:canvas-design",
  "short": "canvas-design",
  "group": "an",
  "fit": 1,
  "what": "Original posters and static art as PNG or PDF.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Make a poster for the Gemcaster demo"
 },
 {
  "id": "anthropic-skills:web-artifacts-builder",
  "short": "web-artifacts-builder",
  "group": "an",
  "fit": 1,
  "what": "Builds larger React and Tailwind pages with multiple components.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Build a full stat-tuning app as an artifact"
 },
 {
  "id": "anthropic-skills:google-workspace",
  "short": "google-workspace",
  "group": "an",
  "fit": 0,
  "what": "Edits Google Docs, Sheets and Slides in your Drive.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Add a tab to my Google Sheet"
 },
 {
  "id": "anthropic-skills:skill-creator",
  "short": "skill-creator",
  "group": "an",
  "fit": 1,
  "what": "Creates and improves skills, and runs evals on how well they trigger.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Make a skill for adding new mobs"
 },
 {
  "id": "anthropic-skills:setup-claude",
  "short": "setup-claude",
  "group": "an",
  "fit": 0,
  "what": "Guided setup: plugins, connectors, a first skill.",
  "env": [
   "code",
   "cloud"
  ],
  "tryIt": "/setup-claude"
 },
 {
  "id": "anthropic-skills:setup-writing-style",
  "short": "setup-writing-style",
  "group": "an",
  "fit": 0,
  "what": "Learns your writing voice from your own messages.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Learn how I write"
 },
 {
  "id": "anthropic-skills:import-memory",
  "short": "import-memory",
  "group": "an",
  "fit": 0,
  "what": "Imports memory exported from another AI assistant.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "Import my ChatGPT memories"
 },
 {
  "id": "anthropic-skills:morning",
  "short": "morning",
  "group": "an",
  "fit": 0,
  "what": "A styled morning brief from your connected tools.",
  "env": [
   "code",
   "cloud",
   "chat"
  ],
  "tryIt": "/morning"
 },
 {
  "id": "project-artifact:project-artifact",
  "short": "project-artifact",
  "group": "dev",
  "fit": 2,
  "what": "Publishes a tabbed project status page: goals, workstreams, risks, decisions.",
  "env": [
   "code"
  ],
  "tryIt": "Make a status page for the codebase health plan"
 },
 {
  "id": "session-report:session-report",
  "short": "session-report",
  "group": "dev",
  "fit": 1,
  "what": "An HTML report of your Claude Code usage across sessions: tokens, cache, skills.",
  "env": [
   "code"
  ],
  "tryIt": "/session-report"
 },
 {
  "id": "frontend-design:frontend-design",
  "short": "frontend-design",
  "group": "dev",
  "fit": 1,
  "what": "Distinctive visual direction for new UI.",
  "env": [
   "code"
  ],
  "tryIt": "Design the Gemcaster main menu mockup"
 },
 {
  "id": "superdesign:superdesign",
  "short": "superdesign",
  "group": "dev",
  "fit": 0,
  "what": "Designs UI on the Superdesign canvas and compares results across models.",
  "env": [
   "code"
  ],
  "tryIt": "Explore three variants of the HUD"
 },
 {
  "id": "claude-code-setup:claude-automation-recommender",
  "short": "claude-automation-recommender",
  "group": "dev",
  "fit": 1,
  "what": "Scans a codebase and recommends hooks, subagents, skills and connectors.",
  "env": [
   "code"
  ],
  "tryIt": "What automations would help gemcaster-play?"
 },
 {
  "id": "code-review:code-review",
  "short": "code-review:code-review",
  "group": "dev",
  "fit": 1,
  "what": "The plugin version of code review, for a GitHub PR.",
  "env": [
   "code"
  ],
  "tryIt": "Review PR 31"
 },
 {
  "id": "spritecook:spritecook-workflow-essentials",
  "short": "spritecook-workflow-essentials",
  "group": "sc",
  "fit": 2,
  "what": "Shared rules for every SpriteCook job: credits, downloads, asset manifests.",
  "env": [
   "code"
  ],
  "tryIt": "(loads with the others)",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-generate-sprites",
  "short": "spritecook-generate-sprites",
  "group": "sc",
  "fit": 2,
  "what": "Generates pixel art or HD stills, matching the style of reference assets.",
  "env": [
   "code"
  ],
  "tryIt": "Make a wind ghost sprite in the style of my frost mob",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-animate-assets",
  "short": "spritecook-animate-assets",
  "group": "sc",
  "fit": 2,
  "what": "Animates an existing sprite from a motion prompt.",
  "env": [
   "code"
  ],
  "tryIt": "Animate the gem golem walking",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-generate-tilesets",
  "short": "spritecook-generate-tilesets",
  "group": "sc",
  "fit": 2,
  "what": "Generates autotile tilesets at a chosen tile size.",
  "env": [
   "code"
  ],
  "tryIt": "A 32px crystal cave tileset",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-use-dual-grid-tilesets",
  "short": "spritecook-use-dual-grid-tilesets",
  "group": "sc",
  "fit": 1,
  "what": "Maps a 15-piece tileset into terrain with a dual-grid renderer.",
  "env": [
   "code"
  ],
  "tryIt": "Explain how to use this tileset in a dual-grid map",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-use-assets-in-godot",
  "short": "spritecook-use-assets-in-godot",
  "group": "sc",
  "fit": 2,
  "what": "Turns spritesheets into Godot SpriteFrames and AnimatedSprite2D nodes.",
  "env": [
   "code"
  ],
  "tryIt": "Import the golem animation into Godot",
  "tip": "The most direct path from generated art into Gemcaster.",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-build-ui-kits",
  "short": "spritecook-build-ui-kits",
  "group": "sc",
  "fit": 1,
  "what": "Concept-first game UI: HUDs, menus, dialogs, with 9-slice data.",
  "env": [
   "code"
  ],
  "tryIt": "Build a gem inventory UI kit",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-upload-assets",
  "short": "spritecook-upload-assets",
  "group": "sc",
  "fit": 1,
  "what": "Uploads local images to SpriteCook to use as references.",
  "env": [
   "code"
  ],
  "tryIt": "Upload gemcaster-art/frost_mob.png as a style reference",
  "auth": "spritecook"
 },
 {
  "id": "spritecook:spritecook-use-presets",
  "short": "spritecook-use-presets",
  "group": "sc",
  "fit": 1,
  "what": "Saves and reuses generation settings for a consistent style.",
  "env": [
   "code"
  ],
  "tryIt": "Save this as my Gemcaster preset",
  "auth": "spritecook"
 },
 {
  "id": "adobe-for-creativity:adobe",
  "short": "adobe",
  "group": "ad",
  "fit": 0,
  "what": "A tour of what the Adobe connector can do.",
  "env": [
   "code"
  ],
  "tryIt": "/adobe",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-anypdf",
  "short": "adobe-anypdf",
  "group": "ad",
  "fit": 0,
  "what": "Acrobat-quality PDF work: compress, OCR, redact, sign, convert.",
  "env": [
   "code"
  ],
  "tryIt": "Compress this PDF under 5 MB",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-anydocx",
  "short": "adobe-anydocx",
  "group": "ad",
  "fit": 0,
  "what": "PDF to Word conversion.",
  "env": [
   "code"
  ],
  "tryIt": "Turn this PDF into a Word doc",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-anyexcel",
  "short": "adobe-anyexcel",
  "group": "ad",
  "fit": 0,
  "what": "Pulls tables out of a PDF into Excel.",
  "env": [
   "code"
  ],
  "tryIt": "Get the tables from this PDF into a spreadsheet",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-anypptx",
  "short": "adobe-anypptx",
  "group": "ad",
  "fit": 0,
  "what": "PDF to PowerPoint conversion.",
  "env": [
   "code"
  ],
  "tryIt": "Turn this PDF into slides",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-document-review",
  "short": "adobe-document-review",
  "group": "ad",
  "fit": 0,
  "what": "Highlights what matters in a PDF and adds comments.",
  "env": [
   "code"
  ],
  "tryIt": "Review this contract",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-design-from-template",
  "short": "adobe-design-from-template",
  "group": "ad",
  "fit": 1,
  "what": "Flyers, posters, social posts and thumbnails from Adobe Express templates.",
  "env": [
   "code"
  ],
  "tryIt": "Make a YouTube thumbnail for the devlog",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-design-to-pdf",
  "short": "adobe-design-to-pdf",
  "group": "ad",
  "fit": 0,
  "what": "A template-based print piece exported as PDF.",
  "env": [
   "code"
  ],
  "tryIt": "Make a printable playtest flyer",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-create-social-variations",
  "short": "adobe-create-social-variations",
  "group": "ad",
  "fit": 1,
  "what": "Crops and exports one image or video for every social platform.",
  "env": [
   "code"
  ],
  "tryIt": "Get this trailer ready for TikTok and X",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-resize-photos-and-videos",
  "short": "adobe-resize-photos-and-videos",
  "group": "ad",
  "fit": 1,
  "what": "Resizes to exact pixel sizes or aspect ratios.",
  "env": [
   "code"
  ],
  "tryIt": "Resize these screenshots to 1920x1080",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-batch-edit-photos",
  "short": "adobe-batch-edit-photos",
  "group": "ad",
  "fit": 0,
  "what": "Gives a set of photos one consistent look.",
  "env": [
   "code"
  ],
  "tryIt": "Make these photos look cohesive",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-retouch-portraits",
  "short": "adobe-retouch-portraits",
  "group": "ad",
  "fit": 0,
  "what": "Bulk portrait retouching.",
  "env": [
   "code"
  ],
  "tryIt": "Retouch this folder of headshots",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-edit-quick-cut",
  "short": "adobe-edit-quick-cut",
  "group": "ad",
  "fit": 1,
  "what": "Cuts a highlight reel from a longer video.",
  "env": [
   "code"
  ],
  "tryIt": "Make a 30-second sizzle reel from this gameplay",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-create-pdfs-from-data",
  "short": "adobe-create-pdfs-from-data",
  "group": "ad",
  "fit": 0,
  "what": "InDesign data merge: one page per CSV row.",
  "env": [
   "code"
  ],
  "tryIt": "Make a card for every row in this CSV",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "adobe-for-creativity:adobe-fonts",
  "short": "adobe-fonts",
  "group": "ad",
  "fit": 1,
  "what": "Finds and previews licensable Adobe Fonts.",
  "env": [
   "code"
  ],
  "tryIt": "A font for a crystal-magic game logo",
  "auth": "adobe-for-creativity"
 },
 {
  "id": "canva:edit-design",
  "short": "edit-design",
  "group": "ca",
  "fit": 0,
  "what": "Edits text, images and layout in an existing Canva design.",
  "env": [
   "code"
  ],
  "tryIt": "Fix the typo on slide 3 of my Canva deck",
  "auth": "canva"
 },
 {
  "id": "canva:get-design-feedback",
  "short": "get-design-feedback",
  "group": "ca",
  "fit": 0,
  "what": "Critiques a Canva design without changing it.",
  "env": [
   "code"
  ],
  "tryIt": "Review my poster",
  "auth": "canva"
 },
 {
  "id": "canva:implement-feedback",
  "short": "implement-feedback",
  "group": "ca",
  "fit": 0,
  "what": "Applies the reviewer comments on a Canva design.",
  "env": [
   "code"
  ],
  "tryIt": "Apply the comments on my deck",
  "auth": "canva"
 },
 {
  "id": "canva:brand-check",
  "short": "brand-check",
  "group": "ca",
  "fit": 0,
  "what": "Checks a design against a brand kit.",
  "env": [
   "code"
  ],
  "tryIt": "Is this on brand?",
  "auth": "canva"
 },
 {
  "id": "canva:bulk-create",
  "short": "bulk-create",
  "group": "ca",
  "fit": 0,
  "what": "One design per row of a spreadsheet, from a template.",
  "env": [
   "code"
  ],
  "tryIt": "A card per mob from this CSV",
  "auth": "canva"
 },
 {
  "id": "canva:resize-for-social-media",
  "short": "resize-for-social-media",
  "group": "ca",
  "fit": 0,
  "what": "Resizes one design into Facebook, Instagram and LinkedIn formats.",
  "env": [
   "code"
  ],
  "tryIt": "Resize this for all socials",
  "auth": "canva"
 },
 {
  "id": "desktop-commander:desktop-commander-overview",
  "short": "desktop-commander-overview",
  "group": "dc",
  "fit": 0,
  "what": "Persistent shells, long processes, SSH and big local files.",
  "env": [
   "code"
  ],
  "tryIt": "Tail the Godot log while I play"
 },
 {
  "id": "desktop-commander:terminal",
  "short": "terminal",
  "group": "dc",
  "fit": 0,
  "what": "Shells that keep their state across turns: REPLs and dev servers.",
  "env": [
   "code"
  ],
  "tryIt": "Keep a Python REPL open for the stats work"
 },
 {
  "id": "desktop-commander:computer-health-check",
  "short": "computer-health-check",
  "group": "dc",
  "fit": 1,
  "what": "A read-only health check of your PC: disk, CPU, startup items.",
  "env": [
   "code"
  ],
  "tryIt": "Check why my PC is slow"
 },
 {
  "id": "desktop-commander:ai-tools-setup",
  "short": "ai-tools-setup",
  "group": "dc",
  "fit": 1,
  "what": "Fixes Claude Desktop and MCP server configs.",
  "env": [
   "code"
  ],
  "tryIt": "Why won't this MCP server connect?",
  "tip": "\"Connection closed\" usually means the launch command is missing, like Node or uv."
 },
 {
  "id": "desktop-commander:knowledge-base",
  "short": "knowledge-base",
  "group": "dc",
  "fit": 0,
  "what": "Builds a Markdown knowledge base that agents can read.",
  "env": [
   "code"
  ],
  "tryIt": "Start a KB for Gemcaster lore"
 },
 {
  "id": "desktop-commander:obsidian-vault",
  "short": "obsidian-vault",
  "group": "dc",
  "fit": 0,
  "what": "Organizes Obsidian vaults.",
  "env": [
   "code"
  ],
  "tryIt": "Tidy my Obsidian vault"
 },
 {
  "id": "unity:new-unity-project",
  "short": "new-unity-project",
  "group": "un",
  "fit": 0,
  "what": "Starts a new Unity project: concept, platforms, packages, source control.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:unity-cli",
  "short": "unity-cli",
  "group": "un",
  "fit": 0,
  "what": "Drives the Unity Editor from the command line: builds, tests, C#.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:unity-package-management",
  "short": "unity-package-management",
  "group": "un",
  "fit": 0,
  "what": "Adds, removes and upgrades UPM packages.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:craft-game-floors",
  "short": "craft-game-floors",
  "group": "un",
  "fit": 0,
  "what": "Polish pass: art style, lighting, juice, sound, menus, saves.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:2d-pixel-perfect",
  "short": "2d-pixel-perfect",
  "group": "un",
  "fit": 0,
  "what": "Fixes blurry or jittery pixel art with PixelPerfectCamera.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:create-2d-physics",
  "short": "create-2d-physics",
  "group": "un",
  "fit": 0,
  "what": "2D physics in both of Unity's 2D systems.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:physics-3d-collision",
  "short": "physics-3d-collision",
  "group": "un",
  "fit": 0,
  "what": "Diagnoses PhysX collisions and triggers that don't fire.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:create-tile-palette-or-rule-tiles",
  "short": "create-tile-palette-or-rule-tiles",
  "group": "un",
  "fit": 0,
  "what": "Tile palettes and rule tiles that connect to neighbors.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:sprite-editor",
  "short": "sprite-editor",
  "group": "un",
  "fit": 0,
  "what": "Sprite slicing, pivots and borders through generated C#.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:sprite-segment-3x3grid",
  "short": "sprite-segment-3x3grid",
  "group": "un",
  "fit": 0,
  "what": "Analyzes a sprite as a 3x3 grid of color cells.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:manage-sprite-atlas",
  "short": "manage-sprite-atlas",
  "group": "un",
  "fit": 0,
  "what": "SpriteAtlas setup and packing.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:initialize-ai-navigation",
  "short": "initialize-ai-navigation",
  "group": "un",
  "fit": 0,
  "what": "NavMesh, agents, obstacles and pathfinding.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:ui",
  "short": "ui",
  "group": "un",
  "fit": 0,
  "what": "Routes a UI request to UI Toolkit, uGUI or IMGUI.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:ui-uitk",
  "short": "ui-uitk",
  "group": "un",
  "fit": 0,
  "what": "UI Toolkit UXML and USS.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:ui-ugui",
  "short": "ui-ugui",
  "group": "un",
  "fit": 0,
  "what": "uGUI Canvas and RectTransform work.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:ui-imgui",
  "short": "ui-imgui",
  "group": "un",
  "fit": 0,
  "what": "IMGUI editor windows and inspectors.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:optimize-text-mesh-pro",
  "short": "optimize-text-mesh-pro",
  "group": "un",
  "fit": 0,
  "what": "TextMeshPro fonts, fallbacks and performance.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:localization",
  "short": "localization",
  "group": "un",
  "fit": 0,
  "what": "Languages, string tables, CJK fonts.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:audio-setup-mixers",
  "short": "audio-setup-mixers",
  "group": "un",
  "fit": 0,
  "what": "Routes audio sources into mixer groups.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:optimize-audio",
  "short": "optimize-audio",
  "group": "un",
  "fit": 0,
  "what": "Audio memory and CPU tuning.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:urp-postprocessing",
  "short": "urp-postprocessing",
  "group": "un",
  "fit": 0,
  "what": "Bloom, tonemapping and other Volume effects.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:migrate-birp-to-urp",
  "short": "migrate-birp-to-urp",
  "group": "un",
  "fit": 0,
  "what": "Moves a project from Built-in to URP.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:validate-urp-render-graph-renderer-feature",
  "short": "validate-urp-render-graph-renderer-feature",
  "group": "un",
  "fit": 0,
  "what": "Reviews a URP Render Graph renderer feature.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:shader-graph-create-custom-node",
  "short": "shader-graph-create-custom-node",
  "group": "un",
  "fit": 0,
  "what": "Custom Shader Graph nodes from HLSL.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:build-gtk",
  "short": "build-gtk",
  "group": "un",
  "fit": 0,
  "what": "Node-based editor tools with Graph Toolkit (Unity 6.6+).",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:generate-editor-search-query",
  "short": "generate-editor-search-query",
  "group": "un",
  "fit": 0,
  "what": "Finds assets and objects with Unity Search.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:asset-transformer-toolkit",
  "short": "asset-transformer-toolkit",
  "group": "un",
  "fit": 0,
  "what": "Imports CAD and 3D models with Pixyz.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:optimize-web",
  "short": "optimize-web",
  "group": "un",
  "fit": 0,
  "what": "Shrinks and speeds up WebGL builds.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:build-live-game",
  "short": "build-live-game",
  "group": "un",
  "fit": 0,
  "what": "Live-game backend: sign-in, progress, leaderboards.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:setup-multiplayer-services",
  "short": "setup-multiplayer-services",
  "group": "un",
  "fit": 0,
  "what": "Online multiplayer: hosting, lobbies, matchmaking.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:setup-vivox-voice-chat",
  "short": "setup-vivox-voice-chat",
  "group": "un",
  "fit": 0,
  "what": "In-game voice and text chat.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:implement-in-app-purchases",
  "short": "implement-in-app-purchases",
  "group": "un",
  "fit": 0,
  "what": "In-app purchases and receipt checks.",
  "env": [
   "code"
  ]
 },
 {
  "id": "unity:levelplay-unity-integration",
  "short": "levelplay-unity-integration",
  "group": "un",
  "fit": 0,
  "what": "Ad mediation with LevelPlay.",
  "env": [
   "code"
  ]
 }
]
