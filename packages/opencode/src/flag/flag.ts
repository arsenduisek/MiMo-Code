import { Config } from "effect"

function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

function falsy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "false" || value === "0"
}

function number(key: string) {
  const value = process.env[key]
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

function nonNegativeNumber(key: string) {
  const value = process.env[key]
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined
}

const NEXUSCODE_EXPERIMENTAL = truthy("NEXUSCODE_EXPERIMENTAL")

// Defaults to false. When enabled, nexus runs in pure-nexus mode:
//   — does NOT inherit Claude Code's settings (CLAUDE.md, ~/.claude/skills, etc.)
//   — does NOT pick up provider API keys from environment variables
//   — falls back to the first available provider model
// Set NEXUSCODE_NEXUS_ONLY=true to disable .claude inheritance and env-based
// provider auto-detection.
const NEXUSCODE_NEXUS_ONLY = truthy("NEXUSCODE_NEXUS_ONLY")
const NEXUSCODE_DISABLE_CLAUDE_CODE_ENV = truthy("NEXUSCODE_DISABLE_CLAUDE_CODE")
const NEXUSCODE_DISABLE_CLAUDE_CODE = NEXUSCODE_NEXUS_ONLY || NEXUSCODE_DISABLE_CLAUDE_CODE_ENV

const NEXUSCODE_DISABLE_EXTERNAL_SKILLS = truthy("NEXUSCODE_DISABLE_EXTERNAL_SKILLS")
const NEXUSCODE_DISABLE_CLAUDE_CODE_SKILLS =
  NEXUSCODE_DISABLE_EXTERNAL_SKILLS || NEXUSCODE_DISABLE_CLAUDE_CODE || truthy("NEXUSCODE_DISABLE_CLAUDE_CODE_SKILLS")
const copy = process.env["NEXUSCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  NEXUSCODE_AUTO_SHARE: truthy("NEXUSCODE_AUTO_SHARE"),
  NEXUSCODE_AUTO_HEAP_SNAPSHOT: truthy("NEXUSCODE_AUTO_HEAP_SNAPSHOT"),
  NEXUSCODE_GIT_BASH_PATH: process.env["NEXUSCODE_GIT_BASH_PATH"],
  NEXUSCODE_CONFIG: process.env["NEXUSCODE_CONFIG"],
  NEXUSCODE_CONFIG_CONTENT: process.env["NEXUSCODE_CONFIG_CONTENT"],

  NEXUSCODE_DISABLE_AUTOUPDATE: truthy("NEXUSCODE_DISABLE_AUTOUPDATE"),

  // Defaults to false (rotation enabled). When enabled, the active log file is
  // never archived to <name>.log.<stamp> on hitting MAX_FILE_SIZE — it grows in
  // place. Useful when an external tool tails/manages the single log file.
  NEXUSCODE_DISABLE_LOG_ROTATION: truthy("NEXUSCODE_DISABLE_LOG_ROTATION"),

  // Defaults to true (analytics enabled). Set NEXUSCODE_ENABLE_ANALYSIS=false
  // to opt out of POSTing model_call/tool_call/agent_request metrics.
  NEXUSCODE_ENABLE_ANALYSIS: !falsy("NEXUSCODE_ENABLE_ANALYSIS"),
  NEXUSCODE_ALWAYS_NOTIFY_UPDATE: truthy("NEXUSCODE_ALWAYS_NOTIFY_UPDATE"),
  NEXUSCODE_DISABLE_PRUNE: truthy("NEXUSCODE_DISABLE_PRUNE"),
  NEXUSCODE_DISABLE_TERMINAL_TITLE: truthy("NEXUSCODE_DISABLE_TERMINAL_TITLE"),
  NEXUSCODE_SHOW_TTFD: truthy("NEXUSCODE_SHOW_TTFD"),
  NEXUSCODE_PERMISSION: process.env["NEXUSCODE_PERMISSION"],

  // Defaults to false. When false, the bash tool intercepts irreversible
  // deletion commands (rm, rmdir, unlink, shred, del, erase, rd, remove-item,
  // and git destructive subcommands like reset --hard / clean -f / branch -D /
  // worktree remove / push --force / stash drop|clear / tag -d) and forces an
  // extra permission prompt with permission="bash_delete" — separate from the
  // normal bash-permission ask so it can't be silently pre-approved by a broad
  // `bash: allow` rule. Set NEXUSCODE_AUTO_APPROVE_DELETE=true to trust the
  // model with deletes and skip the second confirmation.
  NEXUSCODE_AUTO_APPROVE_DELETE: truthy("NEXUSCODE_AUTO_APPROVE_DELETE"),
  // Set by the TUI's --dangerously-skip-permissions flag. When truthy, an
  // allow-all base ruleset is injected UNDER the user's config permission so
  // every tool auto-approves unless the user explicitly denied it.
  NEXUSCODE_DANGEROUSLY_SKIP_PERMISSIONS: truthy("NEXUSCODE_DANGEROUSLY_SKIP_PERMISSIONS"),
  NEXUSCODE_DISABLE_DEFAULT_PLUGINS: truthy("NEXUSCODE_DISABLE_DEFAULT_PLUGINS"),
  NEXUSCODE_DISABLE_LSP_DOWNLOAD: truthy("NEXUSCODE_DISABLE_LSP_DOWNLOAD"),
  NEXUSCODE_ENABLE_EXPERIMENTAL_MODELS: truthy("NEXUSCODE_ENABLE_EXPERIMENTAL_MODELS"),
  NEXUSCODE_DISABLE_AUTOCOMPACT: truthy("NEXUSCODE_DISABLE_AUTOCOMPACT"),
  NEXUSCODE_DISABLE_MODELS_FETCH: truthy("NEXUSCODE_DISABLE_MODELS_FETCH"),
  NEXUSCODE_DISABLE_MOUSE: truthy("NEXUSCODE_DISABLE_MOUSE"),
  NEXUSCODE_OUTPUT_LENGTH_CONTINUATION_LIMIT: number("NEXUSCODE_OUTPUT_LENGTH_CONTINUATION_LIMIT") ?? 3,
  NEXUSCODE_INVALID_OUTPUT_CONTINUATION_LIMIT: number("NEXUSCODE_INVALID_OUTPUT_CONTINUATION_LIMIT") ?? 2,
  NEXUSCODE_TEXT_TOOL_CALL_RETRY_LIMIT: number("NEXUSCODE_TEXT_TOOL_CALL_RETRY_LIMIT") ?? 2,
  // Defaults to false. When enabled, unsigned historical reasoning sent through
  // the Anthropic Messages format receives an empty placeholder signature so it
  // follows the same native thinking-block serialization path as signed content.
  get NEXUSCODE_FORCE_ANTHROPIC_REASONING_CONTENT() {
    return truthy("NEXUSCODE_FORCE_ANTHROPIC_REASONING_CONTENT")
  },

  // Consecutive-block repetition detection for streamed reasoning + text.
  // A block of at least N tokens repeating REPEAT_THRESHOLD times consecutively
  // within the last WINDOW_TOKENS tokens triggers recovery (remind → replan → terminate).
  NEXUSCODE_TEXT_NGRAM_N: number("NEXUSCODE_TEXT_NGRAM_N") ?? 4,
  NEXUSCODE_TEXT_REPEAT_THRESHOLD: number("NEXUSCODE_TEXT_REPEAT_THRESHOLD") ?? 20,
  NEXUSCODE_TEXT_WINDOW_TOKENS: number("NEXUSCODE_TEXT_WINDOW_TOKENS") ?? 500,

  // Caps applied to image attachments before a prompt is sent.
  // NEXUSCODE_MAX_PROMPT_IMAGES (default undefined = no count limit) bounds how
  // many images may be sent per request (oldest excess images are dropped).
  // NEXUSCODE_MAX_PROMPT_IMAGE_SIZE overrides the default per-image byte cap
  // (DEFAULT_MAX_IMAGE_BYTES ~4.5 MB, kept under the provider 5 MB hard limit);
  // oversized images are recompressed under the cap, or stripped to a text
  // placeholder when they can't be compressed. Values must be positive integers.
  NEXUSCODE_MAX_PROMPT_IMAGES: number("NEXUSCODE_MAX_PROMPT_IMAGES"),
  NEXUSCODE_MAX_PROMPT_IMAGE_SIZE: number("NEXUSCODE_MAX_PROMPT_IMAGE_SIZE"),
  NEXUSCODE_NEXUS_ONLY,
  NEXUSCODE_DISABLE_PROVIDER_ENV: NEXUSCODE_NEXUS_ONLY || truthy("NEXUSCODE_DISABLE_PROVIDER_ENV"),
  NEXUSCODE_DISABLE_CLAUDE_CODE,
  get NEXUSCODE_DISABLE_CLAUDE_CODE_MCP() {
    // MCP compatibility stays on in nexus-only mode so users can reuse Claude Code
    // MCP servers without inheriting prompts, skills, or provider env keys.
    return NEXUSCODE_DISABLE_CLAUDE_CODE_ENV || truthy("NEXUSCODE_DISABLE_CLAUDE_CODE_MCP")
  },
  NEXUSCODE_DISABLE_CLAUDE_CODE_PROMPT: NEXUSCODE_DISABLE_CLAUDE_CODE || truthy("NEXUSCODE_DISABLE_CLAUDE_CODE_PROMPT"),
  // Defaults to false (enabled): markdown commands under ~/.claude/commands and
  // {project}/.claude/commands load as slash commands. Independent of the
  // nexus-only master switch. Set NEXUSCODE_DISABLE_CLAUDE_CODE_COMMANDS=true to disable.
  NEXUSCODE_DISABLE_CLAUDE_CODE_COMMANDS: truthy("NEXUSCODE_DISABLE_CLAUDE_CODE_COMMANDS"),
  NEXUSCODE_DISABLE_CLAUDE_CODE_SKILLS,
  NEXUSCODE_DISABLE_EXTERNAL_SKILLS,
  NEXUSCODE_DISABLE_CODEX_SKILLS: NEXUSCODE_DISABLE_EXTERNAL_SKILLS || truthy("NEXUSCODE_DISABLE_CODEX_SKILLS"),
  NEXUSCODE_DISABLE_OPENCODE_SKILLS: NEXUSCODE_DISABLE_EXTERNAL_SKILLS || truthy("NEXUSCODE_DISABLE_OPENCODE_SKILLS"),

  // Skill-search ranking and loading policy. Exact mentions stay above BM25;
  // the BM25/coverage blend has a 0.90 ceiling, and near-max results auto-load.
  NEXUSCODE_SKILL_SEARCH_EXACT_SCORE: 1,
  NEXUSCODE_SKILL_SEARCH_BM25_K1: 1.5,
  NEXUSCODE_SKILL_SEARCH_BM25_LENGTH_NORMALIZATION: 0.75,
  NEXUSCODE_SKILL_SEARCH_BM25_IDF_SMOOTHING: 0.5,
  NEXUSCODE_SKILL_SEARCH_BM25_SCORE_WEIGHT: 0.55,
  NEXUSCODE_SKILL_SEARCH_QUERY_COVERAGE_WEIGHT: 0.35,
  NEXUSCODE_SKILL_SEARCH_AUTO_LOAD_THRESHOLD: 0.85,
  NEXUSCODE_SKILL_SEARCH_SCORE_PRECISION: 4,
  NEXUSCODE_SKILL_SEARCH_MAX_RESULTS: 3,
  NEXUSCODE_SKILL_SEARCH_STEM_MIN_LENGTH: 3,
  NEXUSCODE_SKILL_SEARCH_FILE_SAMPLE_LIMIT: 10,
  NEXUSCODE_SKILL_SEARCH_REFRESH_INTERVAL_MS: 12 * 60 * 60 * 1000,
  // Defaults to true. Set NEXUSCODE_ENABLE_SKILL_SEARCH_REMINDER=false (or 0)
  // to stop injecting skill-search reminders into user queries.
  NEXUSCODE_ENABLE_SKILL_SEARCH_REMINDER: !falsy("NEXUSCODE_ENABLE_SKILL_SEARCH_REMINDER"),

  // Defaults to false. When enabled, skill-source commands appear in the `/`
  // autocomplete dropdown alongside user commands and MCP prompts. Skills are
  // surfaced in `/` completion by default; set NEXUSCODE_DISABLE_SLASH_SKILLS=1
  // to hide them and fall back to the `/skills` picker + model-driven
  // invocation only.
  NEXUSCODE_DISABLE_SLASH_SKILLS: truthy("NEXUSCODE_DISABLE_SLASH_SKILLS"),
  NEXUSCODE_FAKE_VCS: process.env["NEXUSCODE_FAKE_VCS"],

  // When enabled, skips all git subprocess calls during project discovery
  // (which git, rev-parse --git-common-dir, rev-parse --show-toplevel) and
  // branch detection. The project is treated as a non-git directory rooted at
  // the working directory. Use to avoid touching git in restricted/sandboxed
  // environments or where git startup probing is undesirable.
  NEXUSCODE_DISABLE_GIT: truthy("NEXUSCODE_DISABLE_GIT"),
  NEXUSCODE_SERVER_PASSWORD: process.env["NEXUSCODE_SERVER_PASSWORD"],
  NEXUSCODE_SERVER_USERNAME: process.env["NEXUSCODE_SERVER_USERNAME"],
  NEXUSCODE_ENABLE_QUESTION_TOOL: truthy("NEXUSCODE_ENABLE_QUESTION_TOOL"),

  // Defaults to false. Set NEXUSCODE_ENABLE_TRY_BEST_HANDOFF=true (or 1) to
  // enable try-best loop detection, automatic turn pausing, and handoff UI.
  NEXUSCODE_ENABLE_TRY_BEST_HANDOFF: truthy("NEXUSCODE_ENABLE_TRY_BEST_HANDOFF"),

  // Defaults to false. The edit tool does pure exact-string matching with
  // explicit error signals. Set NEXUSCODE_ENABLE_FUZZY_EDIT=true to opt into the
  // legacy multi-stage fuzzy fallback chain (line-trimmed / block-anchor /
  // whitespace-normalized / indentation-flexible / etc.) when old_string fails
  // to match exactly.
  NEXUSCODE_ENABLE_FUZZY_EDIT: truthy("NEXUSCODE_ENABLE_FUZZY_EDIT"),

  // Experimental
  NEXUSCODE_EXPERIMENTAL,
  NEXUSCODE_EXPERIMENTAL_FILEWATCHER: Config.boolean("NEXUSCODE_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  NEXUSCODE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("NEXUSCODE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  NEXUSCODE_EXPERIMENTAL_ICON_DISCOVERY: NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_ICON_DISCOVERY"),
  NEXUSCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("NEXUSCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  NEXUSCODE_ENABLE_EXA: truthy("NEXUSCODE_ENABLE_EXA") || NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_EXA"),
  NEXUSCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS: number("NEXUSCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS"),
  // Token-efficient post-cleanse: strip ANSI / fold \r progress bars / redact
  // secrets / elide super-long lines from bash tool output before it is
  // returned to the model. Only applies when the output fits inline — if the
  // output spills to a truncation file, cleaning is skipped so the on-disk
  // archive stays raw. Off by default. Set to 1/true to opt in.
  NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY: truthy("NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY"),
  // Tunables for the token-efficient post-cleanse pipeline (see
  // src/tool/bash_token_efficient_pipeline.ts). Positive integers only;
  // unset / non-positive values fall back to the documented defaults.
  //   MAX_LINE_CHARS   threshold above which a single line is elided  (default 500)
  //   LINE_HEAD_KEEP   chars kept from the head of an elided line     (default 160)
  //   NEVER_WORSE_MARGIN  bytes the cleaned output must beat the raw  (default 0)
  NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_MAX_LINE_CHARS: number("NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_MAX_LINE_CHARS") ?? 500,
  NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_LINE_HEAD_KEEP: number("NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_LINE_HEAD_KEEP") ?? 160,
  NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_NEVER_WORSE_MARGIN: number("NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_NEVER_WORSE_MARGIN") ?? 0,
  // Heuristic (shape-based) filter pipeline for bash output. Runs AFTER the
  // common pipeline, only when the common pipeline is enabled AND this flag is
  // explicitly opted in. Each shape (gitdiff / pytest / npm / make /
  // stacktrace / tsc / kubectl / json / md / gostest) recognises a command
  // pattern or body fingerprint and rewrites the body to strip predictable
  // noise. Off by default. Set to 1/true to opt in.
  NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_HEURISTIC: truthy("NEXUSCODE_EXPERIMENTAL_TOKEN_EFFICIENCY_HEURISTIC"),
  NEXUSCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX: number("NEXUSCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX"),
  NEXUSCODE_EXPERIMENTAL_OXFMT: NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_OXFMT"),
  NEXUSCODE_EXPERIMENTAL_LSP_TY: truthy("NEXUSCODE_EXPERIMENTAL_LSP_TY"),
  NEXUSCODE_EXPERIMENTAL_LSP_TOOL: NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_LSP_TOOL"),
  // Defaults to OFF: exec (tool_script orchestration) is registered only for
  // GPT-toolset models. Opt in here to expose it to every model.
  NEXUSCODE_ENABLE_EXEC_TOOL: truthy("NEXUSCODE_ENABLE_EXEC_TOOL"),
  // Defaults to OFF for non-GPT models. GPT models enable MCP Tool Search in
  // SessionPrompt regardless of this flag. Opt in here to enable it for every
  // function-calling model.
  NEXUSCODE_EXPERIMENTAL_MCP_TOOL_SEARCH:
    NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_MCP_TOOL_SEARCH"),
  // Defaults to OFF (opt-in): the Orchestrator primary mode — a general
  // coordinator that delegates to child sessions via the `session` tool, with a
  // global singleton workspace and child permission-approval routing. Enable with
  // NEXUSCODE_EXPERIMENTAL_ORCHESTRATOR=true (or the umbrella NEXUSCODE_EXPERIMENTAL).
  NEXUSCODE_EXPERIMENTAL_ORCHESTRATOR: NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_ORCHESTRATOR"),
  // Defaults to OFF (opt-in): dynamic workflows and built-in workflows.
  // Enable with NEXUSCODE_EXPERIMENTAL_WORKFLOW_TOOL=true (or the umbrella
  // NEXUSCODE_EXPERIMENTAL flag).
  NEXUSCODE_EXPERIMENTAL_WORKFLOW_TOOL:
    NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_WORKFLOW_TOOL"),
  // Defaults to true: cron + self-paced loop scheduling are on by default.
  // Set NEXUSCODE_EXPERIMENTAL_CRON=false to opt out. Runtime kill switch is
  // NEXUSCODE_DISABLE_CRON (checked live every tick).
  NEXUSCODE_EXPERIMENTAL_CRON: !falsy("NEXUSCODE_EXPERIMENTAL_CRON"),
  // Keepalive contract for self-paced loops (spec [S8]). Budget = how many
  // "forget" turns the model gets before the loop is declared model_stopped;
  // delay seconds = the auto-arm horizon used for the keepalive fire. Budget
  // accepts 0 (end immediately on the first turn without a re-arm) for tests
  // and aggressive policies. Both are getters so tests can flip the env var
  // between cases without restarting the process.
  get NEXUSCODE_LOOP_KEEPALIVE_BUDGET() {
    return nonNegativeNumber("NEXUSCODE_LOOP_KEEPALIVE_BUDGET") ?? 1
  },
  get NEXUSCODE_LOOP_KEEPALIVE_DELAY_S() {
    return number("NEXUSCODE_LOOP_KEEPALIVE_DELAY_S") ?? 1200
  },
  NEXUSCODE_EXPERIMENTAL_MARKDOWN: !falsy("NEXUSCODE_EXPERIMENTAL_MARKDOWN"),
  NEXUSCODE_MODELS_URL: process.env["NEXUSCODE_MODELS_URL"],
  NEXUSCODE_MODELS_PATH: process.env["NEXUSCODE_MODELS_PATH"],
  NEXUSCODE_DISABLE_EMBEDDED_WEB_UI: truthy("NEXUSCODE_DISABLE_EMBEDDED_WEB_UI"),
  NEXUSCODE_DB: process.env["NEXUSCODE_DB"],

  // Defaults to true — all channels share a single nexus.db. The per-channel
  // DB isolation (nexus-{channel}.db) is unnecessary for nexus since we
  // don't ship multiple release channels yet. Use NEXUSCODE_HOME to isolate dev
  // environments instead. Set NEXUSCODE_DISABLE_CHANNEL_DB=false to restore
  // per-channel isolation.
  NEXUSCODE_DISABLE_CHANNEL_DB: !falsy("NEXUSCODE_DISABLE_CHANNEL_DB"),
  NEXUSCODE_SKIP_MIGRATIONS: truthy("NEXUSCODE_SKIP_MIGRATIONS"),
  NEXUSCODE_STRICT_CONFIG_DEPS: truthy("NEXUSCODE_STRICT_CONFIG_DEPS"),

  NEXUSCODE_WORKSPACE_ID: process.env["NEXUSCODE_WORKSPACE_ID"],
  NEXUSCODE_EXPERIMENTAL_HTTPAPI: truthy("NEXUSCODE_EXPERIMENTAL_HTTPAPI"),
  NEXUSCODE_EXPERIMENTAL_WORKSPACES: NEXUSCODE_EXPERIMENTAL || truthy("NEXUSCODE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.

  // Disables compose-agent-internal skills (e.g. compose:plan, compose:review,
  // compose:tdd). These are hidden workflow-orchestration skills only visible
  // to the compose agent and are NOT part of builtin skills.
  get NEXUSCODE_DISABLE_COMPOSE_SKILLS() {
    return truthy("NEXUSCODE_DISABLE_COMPOSE_SKILLS")
  },
  // Disables user-facing builtin skills shipped with the binary (e.g.
  // evolve). Does not affect compose skills — the two sets are
  // independent and non-overlapping.
  get NEXUSCODE_DISABLE_BUILTIN_SKILLS() {
    return truthy("NEXUSCODE_DISABLE_BUILTIN_SKILLS")
  },
  // Disables the built-in official skills (docx, pdf, pptx, xlsx,
  // html-to-video-pipeline) while keeping the rest of the builtin bundle
  // available. Defaults to false (all skills are extracted and loaded). Set
  // NEXUSCODE_DISABLE_OFFICIAL_SKILLS=true to skip them.
  get NEXUSCODE_DISABLE_OFFICIAL_SKILLS() {
    return truthy("NEXUSCODE_DISABLE_OFFICIAL_SKILLS")
  },
  get NEXUSCODE_DISABLE_PROJECT_CONFIG() {
    return truthy("NEXUSCODE_DISABLE_PROJECT_CONFIG")
  },
  get NEXUSCODE_TUI_CONFIG() {
    return process.env["NEXUSCODE_TUI_CONFIG"]
  },
  get NEXUSCODE_CONFIG_DIR() {
    return process.env["NEXUSCODE_CONFIG_DIR"]
  },
  get NEXUSCODE_HOME() {
    return process.env["NEXUSCODE_HOME"]
  },
  get NEXUSCODE_PURE() {
    return truthy("NEXUSCODE_PURE")
  },
  get NEXUSCODE_PLUGIN_META_FILE() {
    return process.env["NEXUSCODE_PLUGIN_META_FILE"]
  },
  get NEXUSCODE_CLIENT() {
    return process.env["NEXUSCODE_CLIENT"] ?? "cli"
  },
}
