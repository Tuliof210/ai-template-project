# AI Template

This repository stores the architectural rules and AI setup prompts that should be applied before working in the main application.

## Setup Order

Run the bootstrap prompt before RTK.

1. Open [meta/bootstrap.prompt.md] and run it in the repository root.
2. This generates `CLAUDE.md`, which gives the AI tool a minimal, repo-specific brief.
3. After that, install and initialize RTK for your preferred agent.

## RTK

RTK repository: https://github.com/rtk-ai/rtk

Install with:

```bash
brew install rtk
```

Verify the installation:

```bash
rtk --version
rtk gain
```

## Initialize RTK

Use the command that matches your AI tool:

```bash
rtk init -g                  # Claude Code / Copilot (default)
rtk init -g --gemini         # Gemini CLI
rtk init -g --codex          # Codex (OpenAI)
rtk init -g --agent cursor   # Cursor
rtk init --agent windsurf    # Windsurf
rtk init --agent cline       # Cline / Roo Code
rtk init --agent kilocode    # Kilo Code
rtk init --agent antigravity # Google Antigravity
```

Use `-g` for a global install. Omit it if you want RTK configured only for this project.

## Final Check

Restart your AI tool, then test that command rewriting is active:

```bash
git status
```

That command should be automatically rewritten to run through RTK.
