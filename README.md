# donaldamadi.dev

Personal site of **Donald Obinna Amadi** — senior mobile engineer (Flutter, Swift, Kotlin), mostly fintech.

Live: <https://donaldamadi.vercel.app>

---

## Why it's built the way it is

A portfolio is a code sample whether you intend it to be or not, so this one is written the way I'd
write production code rather than the way you'd write a landing page.

**Content is data, not markup.** Everything the site says lives in `src/content/*.ts` behind explicit
types (`Role`, `CaseStudy`, `Decision`, `Package`). Adding a role is a data change; no component is
touched. The `Decision` type is the interesting one — it forces every architectural claim to carry the
alternative that was rejected, because that's the part that actually demonstrates judgement.

**No animation library.** Scroll reveals are a single document-level `IntersectionObserver` that
unobserves on first intersection (`src/lib/use-reveal.ts`). One observer for the whole page rather than
one per component — the per-component version was measurable on mid-range Android. The hero particle
field is ~90 hand-written lines of canvas that pauses when off-screen or when the tab is hidden, and
renders exactly one static frame under `prefers-reduced-motion`.

**No flash of the wrong theme.** A tiny bootstrap script in `<head>` resolves the stored/system theme
and sets `data-theme` before first paint (`src/lib/theme.ts`). Colours are semantic tokens
(`--ink`, `--dim`, `--line`, `--accent`) mapped into Tailwind v4's `@theme inline`, so no component
ever names a colour — it names a role, and both themes come free.

**Keyboard first.** ⌘K opens a hand-rolled command palette with roving focus, Escape-to-dismiss and
focus restoration. Skip link, visible focus rings, `aria-expanded` on the experience ledger,
semantic landmarks throughout.

**Static everything.** Every route — including the four case studies and all five OG images — is
prerendered at build time via `generateStaticParams`, so there is no server work at request time.
OG images are generated with `next/og` rather than being five PNGs someone has to remember to update.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS v4 (`@theme inline` tokens) |
| Type | Instrument Serif · Inter · JetBrains Mono, via `next/font` |
| Hosting | Vercel |

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

## Layout

```
src/
  app/            routes, metadata, sitemap, robots, OG image generation
  components/     presentational + a few client islands (palette, toggle, canvas)
  content/        the actual content, typed — edit here, not in components
  lib/            reveal observer, theme bootstrap, small helpers
```

## Licence

Code is MIT (see `LICENSE`). The written content, case studies and prose are © Donald Obinna Amadi —
please don't lift those wholesale for your own portfolio.
