import { describe, expect, test } from "bun:test"
import path from "path"
import { resolveNexusHome } from "@nexus-code/shared/global"

describe("resolveNexusHome", () => {
  test("with NEXUSCODE_HOME set, resolves 4 subdirs under root", () => {
    const result = resolveNexusHome({
      NEXUSCODE_HOME: "/tmp/profile-a",
    })
    expect(result.mode).toBe("nexus_home")
    expect(result.root).toBe("/tmp/profile-a")
    expect(result.config).toBe(path.join("/tmp/profile-a", "config"))
    expect(result.data).toBe(path.join("/tmp/profile-a", "data"))
    expect(result.state).toBe(path.join("/tmp/profile-a", "state"))
    expect(result.cache).toBe(path.join("/tmp/profile-a", "cache"))
  })

  test("without NEXUSCODE_HOME, falls through to xdg mode", () => {
    const result = resolveNexusHome({})
    expect(result.mode).toBe("xdg")
    expect(result.root).toBeUndefined()
    // xdg paths end with "/nexus"
    expect(result.config.endsWith(path.join("", "nexus"))).toBe(true)
    expect(result.data.endsWith(path.join("", "nexus"))).toBe(true)
    expect(result.state.endsWith(path.join("", "nexus"))).toBe(true)
    expect(result.cache.endsWith(path.join("", "nexus"))).toBe(true)
  })

  test("empty NEXUSCODE_HOME string is treated as unset (xdg mode)", () => {
    const result = resolveNexusHome({ NEXUSCODE_HOME: "" })
    expect(result.mode).toBe("xdg")
  })

  test("relative NEXUSCODE_HOME path throws with clear error", () => {
    expect(() => resolveNexusHome({ NEXUSCODE_HOME: "./foo" })).toThrow(
      /NEXUSCODE_HOME must be an absolute path/,
    )
    expect(() => resolveNexusHome({ NEXUSCODE_HOME: "foo/bar" })).toThrow(
      /NEXUSCODE_HOME must be an absolute path/,
    )
  })

  test("tilde-prefixed NEXUSCODE_HOME throws (not treated as absolute)", () => {
    expect(() => resolveNexusHome({ NEXUSCODE_HOME: "~/profiles/a" })).toThrow(
      /NEXUSCODE_HOME must be an absolute path/,
    )
  })

  test("error message includes the offending value", () => {
    expect(() => resolveNexusHome({ NEXUSCODE_HOME: "./relative" })).toThrow(
      /\.\/relative/,
    )
  })
})
