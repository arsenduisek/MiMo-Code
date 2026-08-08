import { Duration, Effect } from "effect"

const DDG_URL = "https://html.duckduckgo.com/html/"
const UA = "nexus-cli/0.1"

type Result = { url: string; title: string; summary: string }

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
}

function stripTags(s: string) {
  return decodeEntities(s.replace(/<[^>]*>/g, "")).trim()
}

function parseHtml(html: string): Result[] {
  const results: Result[] = []
  const blocks = html.split(/<div class="result"/).slice(1)
  for (const block of blocks) {
    const link = block.match(/class="result__a" href="([^"]*)"[^>]*>(.*?)<\/a>/s)
    const snippet = block.match(/class="result__snippet"[^>]*>(.*?)<\/a>/s)
    if (!link) continue
    const rawHref = link[1]
    let url = rawHref
    try {
      url = new URL(rawHref, "https://duckduckgo.com").searchParams.get("uddg") ?? rawHref
    } catch {}
    results.push({
      url,
      title: stripTags(link[2]),
      summary: snippet ? stripTags(snippet[1]) : "",
    })
  }
  return results
}

function toMillis(d: Duration.Input): number {
  const parsed = Duration.fromInput(d)
  return parsed._tag === "None" ? 0 : Duration.toMillis(parsed.value)
}

export const call = (_http: unknown, _baseUrl: string, _apiKey: string, query: string, _modelId: string, timeout: Duration.Input) =>
  Effect.gen(function* () {
    const url = `${DDG_URL}?q=${encodeURIComponent(query)}`
    const res = yield* Effect.tryPromise(() =>
      fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(toMillis(timeout)) }),
    ).pipe(Effect.orElseSucceed(() => undefined as Response | undefined))
    if (!res || !res.ok) return undefined
    const html = yield* Effect.tryPromise(() => res.text())
    const results = parseHtml(html)
    if (results.length === 0) return undefined
    const lines = results.flatMap((r) => [`- ${r.title || r.url}`, `  ${r.url}`, ...(r.summary ? [`  ${r.summary}`] : [])])
    return ["Sources:", ...lines].join("\n")
  })
