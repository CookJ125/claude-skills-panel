# skills-panel

A Claude Code mod that adds a `/skills-panel` side panel listing every skill you can use, and suggests the ones that fit the thread you're working in.

- **Every skill, in one place.** The list is read from what's installed in each session, with hand-written "Try" prompts and tips where they exist. New skills get a Try prompt and tip written once by Haiku. Each skill shows where it works (Code, Cloud, Chat) and whether it needs a sign-in.
- **Suggestions for busy threads.** Once a thread has 3 of your messages and Claude has edited a file or run a command, Haiku picks every relevant skill, ranked, each with a one-line reason. It re-checks every 3 messages when new files, tools or topics show up, at most 10 times per thread. Haiku sees your recent messages trimmed to a few lines, plus file and tool names, never file contents.
- **A hint above the prompt** when new suggestions arrive while the panel is closed.
- **Cloud sessions** list skills that only exist on your PC, faded and tagged "PC only", and flag suggestions that need a PC session.

## Install

At the prompt of a terminal session:

```
/plugin install skills-panel --marketplace CookJ125/claude-skills-panel
```

From a shell:

```
claude plugin install skills-panel --marketplace CookJ125/claude-skills-panel
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `CookJ125/claude-skills-panel`, then Add plugin.

This repository is private: installing needs read access to it on GitHub and a git credential for github.com on your machine (for example `gh auth login` then `gh auth setup-git`).

### Cloud sessions

Add this to `.claude/settings.json` in a repository you start cloud sessions from:

```json
{
  "extraKnownMarketplaces": {
    "claude-skills-panel": { "source": { "source": "github", "repo": "CookJ125/claude-skills-panel" } }
  },
  "enabledPlugins": { "skills-panel@claude-skills-panel": true }
}
```

## Updating the cloud skill list

Cloud sessions can't see your PC, so `hooks/catalog.ts` holds a snapshot of your full skill list. When it falls behind, the panel on your PC shows **Update cloud list**, which asks Claude to refresh the snapshot, commit it here and update the plugin.

## Development

`claude plugin validate .` and `claude plugin test .` check the mod.
