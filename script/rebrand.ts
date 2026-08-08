import { readdirSync, statSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const ROOT = process.cwd()
const SKIP = new Set([".git", "node_modules", "dist", ".next", ".bun", "target", ".turbo", "coverage", ".cache"])

const RULES: [RegExp, string][] = [
  [/MiMo Code/g, "Nexus Code"],
  [/MiMoCode/g, "NexusCode"],
  [/mimo\.xiaomi\.com\/mimocode\//g, "github.com/arsenduisek/Nexus-Code/docs/"],
  [/mimo\.xiaomi\.com/g, "github.com/arsenduisek/Nexus-Code"],
  [/api\.xiaomimimo\.com/g, "generativelanguage.googleapis.com"],
  [/platform\.xiaomimimo\.com/g, "console.cloud.google.com"],
  [/XiaomiMiMo/g, "NexusCode"],
  [/xiaomimimo/g, "nexuscode"],
  [/@mimo-ai\//g, "@nexus-code/"],
  [/MiMo/g, "Nexus"],
  [/MIMO/g, "NEXUS"],
  [/mimocode/g, "nexus"],
  [/mimo/g, "nexus"],
  [/Xiaomi/g, "Nexus"],
  [/xiaomi/g, "gemini"],
]

let files = 0
let replacements = 0

function isBinary(buf: Buffer) {
  return buf.subarray(0, 8192).includes(0)
}

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) {
      if (!SKIP.has(name)) walk(p)
      continue
    }
    if (st.size > 5 * 1024 * 1024) continue
    const buf = readFileSync(p)
    if (isBinary(buf)) continue
    let text = buf.toString("utf-8")
    if (text.includes("�")) continue
    let changed = 0
    for (const [re, to] of RULES) {
      const count = (text.match(re) || []).length
      if (count > 0) {
        text = text.replace(re, to)
        changed += count
      }
    }
    if (changed > 0) {
      writeFileSync(p, text)
      files++
      replacements += changed
    }
  }
}

walk(ROOT)
console.log(`files: ${files}, approx replacements: ${replacements}`)
