import { describe, expect, test } from "bun:test"
import { GeminiProviderPlugin } from "../../src/plugin/nexus"
import type { PluginInput } from "@nexus-code/plugin"

const fakeInput = {
  client: {},
  project: {},
  worktree: "",
  directory: "",
  experimental_workspace: { register() {} },
  serverUrl: new URL("http://localhost:4096"),
  $: undefined,
} as unknown as PluginInput

describe("GeminiProviderPlugin", () => {
  test("registers the google (Gemini) provider placeholder", async () => {
    const hooks = await GeminiProviderPlugin(fakeInput)
    const cfg: any = {}
    await hooks.config!(cfg)
    expect(cfg.provider.google).toBeDefined()
  })

  test("keeps existing provider config intact", async () => {
    const hooks = await GeminiProviderPlugin(fakeInput)
    const cfg: any = { provider: { openrouter: { name: "OpenRouter" } } }
    await hooks.config!(cfg)
    expect(cfg.provider.openrouter.name).toBe("OpenRouter")
    expect(cfg.provider.google).toBeDefined()
  })
})
