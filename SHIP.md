# Shipping changes

Repo: **https://github.com/donaldamadi/portfolio**
Host: **Vercel**, project `portfolio` (team `donaldamadis-projects`)
Domain: **https://donaldamadi.dev**. See `DOMAIN.md` for the DNS setup.

## Once, before your next commit

Reviewing this repo from the sandbox left a stale `.git/index.lock` behind, because the sandbox filesystem
won't let me delete files, only create them. Git will refuse to commit until it's gone:

```bash
rm -f .git/index.lock
```

## The loop

```bash
npm run typecheck && npm run lint && npm run build   # what CI will run anyway
git add -A
git commit -m "..."
git push
```

Vercel builds `main` and promotes it to production. Pull requests get their own preview URL, and
GitHub Actions runs typecheck → lint → build on both (`.github/workflows/ci.yml`).

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Where things live

```
src/
  app/            routes, metadata, sitemap, robots, OG image generation
  components/     presentational, plus a few client islands (palette, toggle, canvas)
  content/        the actual content, typed. Edit here, not in components
  lib/            reveal observer, theme bootstrap, small helpers
```

One constant, `SITE_URL` in `src/content/profile.ts`, feeds `metadataBase`, canonical URLs, the
sitemap, `robots.txt`, the OG image URLs and the JSON-LD `Person` schema. It is the only place the
domain is written down.

## Routes worth knowing

| Path | What it does |
| --- | --- |
| `/work` | 308 to `/#work`, because there's no index page, so a hand-trimmed URL lands somewhere useful |
| `/about` | The longer story, education, teaching, smaller projects and practicalities |
| `/cv`, `/resume` | 307 to the CV PDF. Easier to say out loud than a filename |
| `/opengraph-image` | Generated at build time, not a PNG anyone has to remember to update |
| `/sitemap.xml`, `/robots.txt` | Generated from the content layer |

## What's verified, as of the last change

- `next build` clean. 16 routes, all prerendered static (4 case studies + 5 generated OG images).
- `tsc --noEmit` clean under `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`.
- Headless Chromium at 1440/1280/390px in both themes: no console errors, no failed requests, no
  horizontal overflow, one `h1` per page, no heading-level skips, every external link carries
  `rel="noreferrer"`, no unlabelled controls, `prefers-reduced-motion` honoured.
- Contrast measured programmatically against the current palette. Every text token clears WCAG AA
  (4.5:1) on both `--bg` and `--surface`, in both themes. `--faint` is the tight one: it carries the
  eyebrow and rail labels, which are the smallest type on the page, so if you ever darken it in dark
  mode or lighten it in light mode, re-measure.

## Turning on "Ask my AI"

The assistant needs one environment variable in Vercel: **Settings → Environment Variables →
`ANTHROPIC_API_KEY`** (Production and Preview), then redeploy. Until it's set, the assistant still
answers, by showing the most relevant passage from your notes instead of a written answer.

- Model: Claude Opus 5.5 at low effort, with server-side refusal fallbacks on.
- Knowledge: `knowledge/` plus Medium, Substack and GitHub, rebuilt before every build. See
  `knowledge/README.md`. The Substack feed is assumed to be `donaldamadi.substack.com/feed`; if your
  publication lives elsewhere, change `FEEDS` in `scripts/build-knowledge.mts`.
- Cost guard: 15 questions per visitor per 10 minutes, per server instance. For a hard limit, add a
  Vercel Firewall rate-limit rule on `/api/ask`, and set a monthly spend limit on the Anthropic key.

## Read this before you send the link to anyone

Everything factual comes from your CVs, your GitHub and your Medium posts. But the four case studies
in `src/content/case-studies.ts` are **narrative written around your CV bullet points**. The problems,
the constraints, and especially the "what I rejected" panels are reconstructions of the engineering
reasoning, not transcriptions of it.

They're the strongest thing on the site, and they're exactly what an interviewer will ask you to
expand on. **If a decision is described in a way you couldn't defend for ten minutes under
questioning, rewrite it or cut it.**

Still worth a second look:

- `src/content/pindey.ts`: verified product context only. Never use "track" or any form of it about
  PinDey. `stack` is empty on purpose (no named tech until confirmed), and there are no store links or
  user numbers until you add them. Both are marked `TODO(donald)`.
- `src/content/profile.ts` → `practicalities`: relocation and sponsorship, now only on `/about`. Keep it,
  trim it, or move it to the CV.
- `src/content/work.ts` → `work`: Ofin Eko is listed as React Native (confirmed Nov 2026). Expo or bare,
  and store links, are TODOs. React work is PinDey's web apps, Uplines (Equivator), Adduce and the job
  scraper. Don't add a React Native claim that you can't demo or talk through.
- `public/Donald-Amadi-CV.pdf` is the full-stack CV (Nov 2026) with an Ofin Eko entry (React Native)
  added under Projects & Open Source. It was spliced into the LaTeX PDF, not regenerated, so when you
  next edit the CV's LaTeX source, add the Ofin Eko entry there too or it will drop out.
- `src/content/career-run.ts`: the game's eight chapters. Every bug, fix and "Shipped:" line is drawn
  from your experience and case studies. If a role or date changes there, change it here too.
- `src/lib/achievements.ts`: the ten things to find. Progress lives only in the visitor's browser.
- `src/content/work.ts` → `offTheClock`: two lines of your own prose, unattributed and unlabelled.
  Delete the block if you'd rather keep that separate from work.
- The SnapPay dates (`Apr 2026 - Jun 2026`) overlap Zedcrest and MedPal. That's accurate to your CV
  and normal for contract work, but expect to be asked about it.
