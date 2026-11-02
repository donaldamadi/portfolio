/**
 * Builds the knowledge base behind "Ask my AI": src/knowledge/corpus.json.
 *
 *   npm run knowledge        (also runs automatically before every build)
 *
 * Sources, in order of authority:
 *   1. knowledge/notes/*.md   corrections and pasted notes (LinkedIn, X); templates are skipped
 *   2. knowledge/cv/*.txt     the four CVs, phone numbers removed
 *   3. src/content/*.ts       the site's own typed content: experience, case studies, work, PinDey
 *   4. GitHub                 public repos and their READMEs
 *   5. Medium and Substack    full articles from their RSS feeds
 *
 * Remote sources fail soft. If one can't be reached (no network, rate limit, a feed moved), the chunks
 * it produced last time are kept, so a flaky build never makes the assistant forget something.
 */
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "src/knowledge/corpus.json");
const SITE = "https://donaldamadi.dev";
const GITHUB_USER = "donaldamadi";
const KNOWN_REPOS = ["flutter-skill-gen", "multi-image-viewer", "job-scraper-backend", "kmm-notes-app", "portfolio"];
const FEEDS = [
  { kind: "medium", url: "https://medium.com/feed/@thatmandonald" },
  { kind: "substack", url: "https://donaldamadi.substack.com/feed" },
] as const;

type Kind = "note" | "cv" | "site" | "case-study" | "github" | "medium" | "substack";
type Doc = { id: string; title: string; url?: string; kind: Kind; text: string };
type Corpus = {
  generatedAt: string;
  sources: { id: string; title: string; url?: string; kind: Kind }[];
  chunks: { s: number; t: string }[];
};

/* ---------------------------------------------------------------- helpers */

const clean = (s: string) =>
  s
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function stripHtml(html: string): string {
  return clean(
    html
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .replace(/<(script|style|figure|figcaption)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<\/(p|h[1-6]|li|blockquote|pre|div)>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&#x27;|&rsquo;/g, "’")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))),
  );
}

function stripMarkdown(md: string): string {
  return clean(
    md
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/^#{1,6}\s*/gm, "")
      // Keep underscores: package names like flutter_skill_gen depend on them.
      .replace(/[*`>|]/g, " ")
      .replace(/^\s*[-=]{3,}\s*$/gm, ""),
  );
}

async function get(url: string, ms = 9000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(ms),
      headers: { "user-agent": "donaldamadi.dev knowledge builder", accept: "*/*" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Paragraph-aware chunks of roughly 450 to 1100 characters, each carrying its source title. */
function chunk(doc: Doc): string[] {
  const paras = doc.text.split(/\n{2,}|\n(?=•|- )/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let buf = "";
  for (const p of paras) {
    if (buf && buf.length + p.length > 1100) {
      out.push(buf);
      buf = "";
    }
    buf = buf ? `${buf}\n${p}` : p;
    if (buf.length >= 450) {
      out.push(buf);
      buf = "";
    }
  }
  if (buf) out.push(buf);
  return out.map((t) => `[${doc.title}]\n${t.length > 1600 ? t.slice(0, 1600) : t}`);
}

/* ---------------------------------------------------------------- local sources */

async function notes(): Promise<Doc[]> {
  const dir = path.join(root, "knowledge/notes");
  const docs: Doc[] = [];
  for (const file of (await readdir(dir)).sort()) {
    if (!file.endsWith(".md")) continue;
    const raw = await readFile(path.join(dir, file), "utf8");
    if (raw.includes("TEMPLATE:")) continue;
    const name = file.replace(/\.md$/, "");
    docs.push({ id: `note-${name}`, title: name === "corrections" ? "Corrections confirmed by Donald" : `Notes: ${name}`, kind: "note", text: stripMarkdown(raw) });
  }
  return docs;
}

async function cvs(): Promise<Doc[]> {
  const dir = path.join(root, "knowledge/cv");
  const docs: Doc[] = [];
  for (const file of (await readdir(dir)).sort()) {
    if (!file.endsWith(".txt")) continue;
    const raw = await readFile(path.join(dir, file), "utf8");
    const title = raw.match(/^# (.+)$/m)?.[1] ?? file;
    docs.push({ id: `cv-${file.replace(/\.txt$/, "")}`, title, url: `${SITE}/cv`, kind: "cv", text: raw.replace(/^# .+\n/, "") });
  }
  return docs;
}

async function site(): Promise<Doc[]> {
  const { profile } = await import("../src/content/profile.ts");
  const { experience } = await import("../src/content/experience.ts");
  const { caseStudies } = await import("../src/content/case-studies.ts");
  const { work, packages, projects, articles, volunteering } = await import("../src/content/work.ts");
  const { pindey } = await import("../src/content/pindey.ts");

  const docs: Doc[] = [
    {
      id: "site-about",
      title: "About Donald (donaldamadi.dev/about)",
      url: `${SITE}/about`,
      kind: "site",
      text: [
        `${profile.name} (${profile.shortName}), ${profile.role}, ${profile.location}. ${profile.hero.intro} ${profile.hero.status}`,
        ...profile.longVersion,
        `Education: ${profile.education.degree}, ${profile.education.school}, ${profile.education.graduated}. ${profile.education.note}`,
        `Availability: ${profile.practicalities}`,
      ].join("\n\n"),
    },
    {
      id: "site-pindey",
      title: "PinDey (pindey.app)",
      url: "https://pindey.app",
      kind: "site",
      text: [
        `${pindey.name}: ${pindey.oneLiner} Tagline: "${pindey.tagline}" Walkthrough: ${pindey.links.demo.href}`,
        pindey.problem.join(" "),
        `${pindey.finder.honest.title} ${pindey.finder.honest.body.join(" ")}`,
        ...pindey.features.map((f) => `${f.name}: ${f.body}`),
        `Also: ${pindey.extras.join("; ")}.`,
        `Privacy: ${pindey.privacy.map((p) => `${p.big} ${p.small}`).join(" ")}`,
        pindey.monorepo,
        ...pindey.surfaces.map((s) => `${s.name} (${s.stack.join(", ")}): ${s.summary}`),
      ].join("\n\n"),
    },
    ...experience.map((r) => ({
      id: `site-role-${r.id}`,
      title: `${r.title} at ${r.company}`,
      url: `${SITE}/#experience`,
      kind: "site" as const,
      text: [
        `${r.company}${r.product ? ` (${r.product})` : ""}, ${r.title}, ${r.employment}, ${r.location}, ${r.start} to ${r.end}.`,
        r.summary,
        ...r.highlights,
        `Stack: ${r.stack.join(", ")}.`,
      ].join("\n\n"),
    })),
    ...caseStudies.map((c) => ({
      id: `case-${c.slug}`,
      title: `Case study: ${c.kicker}, ${c.title}`,
      url: `${SITE}/work/${c.slug}`,
      kind: "case-study" as const,
      text: [
        `${c.company}, ${c.role}, ${c.period}. ${c.summary}`,
        `Problem: ${c.problem.join(" ")}`,
        `Constraints: ${c.constraints.join(" ")}`,
        ...c.decisions.map((d) => `Decision: ${d.title}. ${d.body} Rejected: ${d.rejected}`),
        `Outcome: ${c.outcome.join(" ")}`,
        `Stack: ${c.stack.join(", ")}.`,
      ].join("\n\n"),
    })),
    ...work.map((w) => ({
      id: `site-work-${w.id}`,
      title: `${w.name} (${w.org})`,
      url: w.caseStudy ? `${SITE}/work/${w.caseStudy}` : `${SITE}/#work`,
      kind: "site" as const,
      text: `${w.name}, ${w.org}, ${w.period}. Platforms: ${w.platforms.join(", ")}. ${w.what} ${w.body} Stack: ${w.stack.join(", ")}.`,
    })),
    {
      id: "site-open-source",
      title: "Open source packages on pub.dev",
      url: "https://pub.dev/publishers/donaldamadi/packages",
      kind: "site",
      text: packages.map((p) => `${p.name} (${p.language}, ${p.license}, since ${p.since}): ${p.tagline} ${p.description}`).join("\n\n"),
    },
    {
      id: "site-projects-writing",
      title: "Side projects, writing and community",
      url: `${SITE}/about`,
      kind: "site",
      text: [
        ...projects.map((p) => `${p.name} (${p.period}): ${p.tagline}. ${p.description}`),
        ...articles.map((a) => `Article: "${a.title}" (${a.publication}, ${a.date}) ${a.href}. ${a.blurb}`),
        ...volunteering.map((v) => `${v.org}, ${v.role} (${v.period}): ${v.body}`),
      ].join("\n\n"),
    },
  ];
  return docs;
}

/* ---------------------------------------------------------------- remote sources */

async function github(): Promise<Doc[] | null> {
  let repos: { name: string; description?: string | null; html_url: string; default_branch?: string; fork?: boolean; language?: string | null }[] = [];
  const list = await get(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`);
  if (list) {
    try {
      repos = (JSON.parse(list) as typeof repos).filter((r) => !r.fork);
    } catch {
      repos = [];
    }
  }
  if (!repos.length) repos = KNOWN_REPOS.map((name) => ({ name, html_url: `https://github.com/${GITHUB_USER}/${name}` }));

  const docs: Doc[] = [];
  for (const r of repos.slice(0, 30)) {
    let readme: string | null = null;
    for (const branch of [r.default_branch, "main", "master"].filter(Boolean)) {
      readme = await get(`https://raw.githubusercontent.com/${GITHUB_USER}/${r.name}/${branch}/README.md`);
      if (readme) break;
    }
    if (!readme && !r.description) continue;
    const body = stripMarkdown(readme ?? "").slice(0, 6000);
    docs.push({
      id: `github-${r.name}`,
      title: `GitHub: ${r.name}`,
      url: r.html_url,
      kind: "github",
      text: [r.description, r.language ? `Language: ${r.language}.` : "", body].filter(Boolean).join("\n\n"),
    });
  }
  return docs.length ? docs : null;
}

async function feed(kind: "medium" | "substack", url: string): Promise<Doc[] | null> {
  const xml = await get(url);
  if (!xml || !xml.includes("<item")) return null;
  const docs: Doc[] = [];
  for (const item of xml.split(/<item[\s>]/).slice(1)) {
    const tag = (name: string) => item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "";
    const title = stripHtml(tag("title"));
    const link = stripHtml(tag("link")).split("?")[0];
    const date = stripHtml(tag("pubDate"));
    const body = stripHtml(tag("content:encoded") || tag("description")).slice(0, 14000);
    if (!title || !body) continue;
    docs.push({
      id: `${kind}-${link.replace(/[^a-z0-9]+/gi, "-").slice(-60)}`,
      title: `${kind === "medium" ? "Medium" : "Substack"}: ${title}`,
      url: link,
      kind,
      text: `${title}${date ? ` (${date})` : ""}\n\n${body}`,
    });
  }
  return docs.length ? docs : null;
}

/* ---------------------------------------------------------------- build */

async function previous(): Promise<Corpus | null> {
  try {
    return JSON.parse(await readFile(OUT, "utf8")) as Corpus;
  } catch {
    return null;
  }
}

function keepFromPrevious(prev: Corpus | null, kind: Kind): Doc[] {
  if (!prev) return [];
  return prev.sources
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.kind === kind)
    .map(({ s, i }) => ({
      ...s,
      text: prev.chunks
        .filter((c) => c.s === i)
        .map((c) => c.t.replace(/^\[[^\]]*\]\n/, ""))
        .join("\n\n"),
    }));
}

async function main() {
  const prev = await previous();
  const docs: Doc[] = [...(await notes()), ...(await cvs()), ...(await site())];
  const log: string[] = [];

  const gh = await github();
  if (gh) {
    docs.push(...gh);
    log.push(`github: ${gh.length} repos`);
  } else {
    const kept = keepFromPrevious(prev, "github");
    docs.push(...kept);
    log.push(`github: unreachable, kept ${kept.length} from last build`);
  }
  for (const f of FEEDS) {
    const got = await feed(f.kind, f.url);
    if (got) {
      docs.push(...got);
      log.push(`${f.kind}: ${got.length} posts`);
    } else {
      const kept = keepFromPrevious(prev, f.kind);
      docs.push(...kept);
      log.push(`${f.kind}: unreachable, kept ${kept.length} from last build`);
    }
  }

  const corpus: Corpus = { generatedAt: new Date().toISOString(), sources: [], chunks: [] };
  for (const doc of docs) {
    const s = corpus.sources.push({ id: doc.id, title: doc.title, url: doc.url, kind: doc.kind }) - 1;
    for (const t of chunk(doc)) corpus.chunks.push({ s, t });
  }
  // Never let a phone number into the corpus, whatever a source contains.
  const json = JSON.stringify(corpus).replace(/\+?234[\s\d]{9,13}|\b0?[789][01]\d[\s-]?\d{3}[\s-]?\d{4}\b/g, "");
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, json);
  console.log(`knowledge: ${corpus.sources.length} sources, ${corpus.chunks.length} chunks (${(json.length / 1024).toFixed(0)} KB). ${log.join("; ")}`);
}

await main();
