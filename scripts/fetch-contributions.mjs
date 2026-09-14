// Reads the contribution graph straight from the public GitHub profile and saves it
// to public/github-contributions.json, so the site shows the same numbers as GitHub.
// No token needed. If GitHub can't be reached, the existing file is left as is.
import { readFile, writeFile } from 'node:fs/promises'

const USERNAME = 'moi-script'
const OUT = new URL('../public/github-contributions.json', import.meta.url)

async function main() {
  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
    headers: { 'User-Agent': 'portfolio-contributions-script' },
  })
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`)
  const html = await res.text()

  // Each day is a <td data-date=... id=... data-level=...>; its count lives in <tool-tip for=id>.
  const counts = new Map()
  for (const [, id, n] of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>\s*(\d+|No) contributions?/g)) {
    counts.set(id, n === 'No' ? 0 : Number(n))
  }
  const contributions = []
  for (const [td] of html.matchAll(/<td[^>]*data-date="[^"]+"[^>]*>/g)) {
    const date = td.match(/data-date="([^"]+)"/)[1]
    const id = td.match(/id="([^"]+)"/)?.[1]
    const level = Number(td.match(/data-level="(\d)"/)?.[1] ?? 0)
    contributions.push({ date, count: counts.get(id) ?? 0, level })
  }
  contributions.sort((a, b) => a.date.localeCompare(b.date))
  if (contributions.length < 300) throw new Error(`Only parsed ${contributions.length} days; page format may have changed`)

  const total = contributions.reduce((sum, d) => sum + d.count, 0)
  const next = { username: USERNAME, total, contributions }

  // Skip rewriting when nothing changed (keeps the daily workflow from making empty commits).
  const prev = await readFile(OUT, 'utf8').then(JSON.parse).catch(() => null)
  if (prev && JSON.stringify(prev.contributions) === JSON.stringify(contributions)) {
    console.log(`contributions unchanged (${total})`)
    return
  }
  await writeFile(OUT, JSON.stringify({ ...next, updatedAt: new Date().toISOString() }) + '\n')
  console.log(`saved ${contributions.length} days, ${total} contributions`)
}

main().catch((err) => {
  console.warn(`[contributions] skipped: ${err.message}`)
})
