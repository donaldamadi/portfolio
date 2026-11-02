# What "Ask my AI" knows

`npm run knowledge` (run automatically before every build) turns these into `src/knowledge/corpus.json`:

- `notes/corrections.md`: facts you've confirmed that override older CV lines. Most authoritative.
- `notes/linkedin.md`, `notes/x.md`: paste your LinkedIn About, recommendations and posts, and the X posts
  you want it to know. Neither site allows automated reading, so these are filled in by hand. Delete the
  `TEMPLATE` comment when you paste, or the file is skipped.
- `cv/*.txt`: the four CVs as plain text, phone numbers removed.
- The site's own content in `src/content/` (experience, case studies, work, PinDey).
- GitHub READMEs, and full Medium and Substack articles from their RSS feeds, fetched at build time.
  If a feed can't be reached, the articles from the last successful build are kept.

To add anything else, drop a `.md` file into `notes/`.
