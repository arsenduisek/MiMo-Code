<h1 align="center">NexusCode</h1>

<p align="center"><strong>Nexus Code: Where Models and Agents Co-Evolve</strong></p>

<p align="center">
  <a href="https://github.com/arsenduisek/Nexus-Code/coder">Website</a> | <a href="https://github.com/arsenduisek/Nexus-Code/en/blog/nexus-code-long-horizon">Blog</a> | <a href="https://github.com/NexusCode/Nexus-Code">GitHub</a>
</p>

---

NexusCode is a terminal-native AI coding assistant. It can read and write code, run commands, manage Git, and use a persistent memory system to keep a deep understanding of your project across sessions while continuously improving itself.

Nexus Auto is built in as a free-for-limited-time channel, so you can start with zero configuration. NexusCode also supports connecting to any mainstream LLM provider API.

---

## Quick Start

```bash
# One-line install (macOS / Linux)
curl -fsSL https://github.com/arsenduisek/Nexus-Code/install | bash

# One-line install (Windows PowerShell)
powershell -ep Bypass -c "irm https://github.com/arsenduisek/Nexus-Code/install.ps1 | iex"

# Or install via npm (all platforms)
# Mirror registries (e.g. cnpm/taobao) may have delayed platform package sync
npm install -g @nexus-code/cli --registry https://registry.npmjs.org

# Run
nexus
```

The first launch guides you through configuration automatically. Supported options:
- **Nexus Auto (free for a limited time)** — anonymous channel, zero configuration
- **Nexus Nexus Platform** — OAuth login
- **Codex (ChatGPT Pro/Plus)** — OpenAI OAuth login
- **Import from Claude Code** — migrate existing authentication in one step
- **Provider list** — connect catalog providers by API key, or OAuth where supported (e.g. xAI/Grok)
- **Custom Provider** — add any OpenAI-compatible API in the TUI

---

## Core Features

- **Multiple Agents** — build (default), plan (read-only analysis), compose (specs-driven orchestration); press `Tab` to switch
- **Persistent Memory** — cross-session project knowledge, checkpoints, and task progress powered by SQLite FTS5
- **Intelligent Context Management** — automatic checkpoints, context reconstruction, and budgeted injection to stay within model limits
- **Task Tracking** — tree-shaped task system integrated with the checkpoint system
- **Subagent System** — parallel subagents with lifecycle tracking, cancellation, and background execution
- **Goal / Stop Condition** — judge model prevents premature stops during autonomous work
- **Compose Mode** — structured workflow for specs-driven development; recommended via the `/compose-next` skill on the build agent
- **Builtin Skills** — 20+ reusable instruction sets (PDF/Office generation, research, design, and more), invoked via `/skill-name` or auto-matched by relevance
- **Workflows** — deterministic multi-agent orchestration scripts, including built-in compose, deep-research, fact-check, and research-experiment pipelines
- **Voice Input** — real-time streaming voice input powered by TenVAD and Nexus ASR
- **Dream & Distill** — extract knowledge into memory (`/dream`) and discover reusable workflows (`/distill`)

For detailed documentation, configuration options, and troubleshooting, see the [GitHub repository](https://github.com/NexusCode/Nexus-Code).

---

## License

Source code is licensed under the [MIT License](https://github.com/NexusCode/Nexus-Code/blob/main/LICENSE).

Use of NexusCode is also subject to the [Use Restrictions](https://github.com/NexusCode/Nexus-Code/blob/main/USE_RESTRICTIONS.md).
Use of Nexus Nexus-hosted services is subject to the [Nexus Terms of Service](https://console.cloud.google.com/docs/terms/user-agreement).
Use of the Nexus name, logo, and trademarks is subject to the Nexus Trademark Policy.
