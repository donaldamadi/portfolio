# Shipping this — copy, paste, done

The GitHub repo already exists and is empty: **https://github.com/donaldamadi/portfolio** (public).
This folder is already a git repository with the code committed, and `origin` already points at it.

## 1. Repair, commit, push

I built and committed this from a sandbox whose filesystem refuses `unlink`, so git couldn't clean up
its own scratch files — it left three `.lock` files and ~54 zero-byte `tmp_obj_*` files in `.git/`.
They're inert, but the `.lock` files will block your next `git commit` until they're gone.

Open Terminal and paste this whole block:

```bash
cd "/Users/obinnaamadi/Documents/Claude/Projects/Project Escape/portfolio"

# clean up after the sandbox
rm -f .git/HEAD.lock .git/index.lock .git/objects/maintenance.lock
find .git/objects -name 'tmp_obj_*' -delete

# commit this file, then ship
git add -A
git commit -m "docs: shipping notes"
git push -u origin main
```

You'll be asked to authenticate — browser sign-in, or a personal access token as the password.

Sanity check afterwards: `git log --oneline` should show two commits, and
https://github.com/donaldamadi/portfolio should no longer say "This repository is empty."

## 2. Deploy to Vercel

Import the repo directly:

**https://vercel.com/new/import?s=https://github.com/donaldamadi/portfolio**

Vercel auto-detects Next.js. No environment variables, nothing to configure. Every future `git push`
redeploys production automatically, and every pull request gets its own preview URL.

## 3. One line to change after the first deploy

Vercel gives you the real domain. Put it in `src/content/profile.ts`:

```ts
export const SITE_URL = "https://<whatever-vercel-gave-you>.vercel.app";
```

That single constant feeds `metadataBase`, the sitemap, `robots.txt`, canonical URLs and the JSON-LD
`Person` schema — it's the only place the domain is written down. Same line if you later attach a
custom domain. `donaldamadi.dev` is worth the ~£12/year; it reads better at the top of a CV than a
`.vercel.app` subdomain, and recruiters do notice.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

## What's already verified

- `next build` — clean. All 16 routes prerendered static (4 case studies + 5 generated OG images).
- `tsc --noEmit` — clean under `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`.
- Rendered in headless Chromium at 1440px, 1280px and 390px, in both themes: no console errors, no
  failed requests, no horizontal overflow, exactly one `h1` per page, no heading-level skips, every
  external link carries `rel="noreferrer"`, no unlabelled controls, `prefers-reduced-motion` honoured.

## Read this before you share the link

Everything factual comes from your CVs, your GitHub and your Medium posts. But the four case studies
in `src/content/case-studies.ts` are **narrative written around your CV bullet points** — the
problems, the constraints, and especially the "what I rejected" panels are reconstructions of the
engineering reasoning, not transcriptions of it.

They're the strongest thing on the site, and they're exactly what an interviewer will ask you to
expand on. So read them and correct anything that isn't how it actually went. **If a decision is
described in a way you couldn't defend for ten minutes under questioning, rewrite it or cut it.**

Two other things worth a look:

- `src/content/profile.ts` → `availability` — I've written you as relocation-ready with sponsorship
  required, naming Ireland/NL/DK/DE/FR/CA/UK. Adjust if you'd rather not lead with that.
- `src/content/work.ts` → `offTheClock` — two lines of your own prose, unattributed and unlabelled.
  Deliberately quiet. Delete the block if you'd rather keep that separate from work.
