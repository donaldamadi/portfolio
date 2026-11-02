/**
 * Retrieval for "Ask my AI": BM25 over the knowledge chunks built by
 * scripts/build-knowledge.mts. Server-only: imported by the API route, never by
 * a client component, so the corpus never ships to the browser.
 *
 * The corpus is small (a few hundred chunks), so a plain in-memory index built
 * once per cold start is plenty, with no vector database to run.
 */
import corpus from "@/knowledge/corpus.json";

type Kind = "note" | "cv" | "site" | "case-study" | "github" | "medium" | "substack";
export type Source = { id: string; title: string; url?: string; kind: Kind };
type Chunk = { s: number; t: string };

const SOURCES = corpus.sources as Source[];
const CHUNKS = corpus.chunks as Chunk[];

const STOP = new Set(
  "a an and are as at be been but by can could did do does for from had has have he her his how i if in into is it its me my of on or our she so than that the their them then there these they this to too was we were what when where which who why will with would you your about tell does did donald amadi him".split(
    " ",
  ),
);

/** Phrases visitors use, mapped to the words the sources use. */
const EXPAND: Record<string, string> = {
  rn: "react native",
  "react-native": "react native",
  backend: "backend node api server nestjs postgresql",
  frontend: "frontend react next.js web",
  fullstack: "react node backend web mobile",
  mobile: "mobile flutter ios android react native",
  contact: "contact email linkedin",
  reach: "contact email linkedin",
  hire: "contact email availability roles relocation",
  relocate: "relocation relocating visa sponsorship remote",
  remote: "remote relocation",
  ai: "ai agents skill claude coding assistants",
  payments: "payments lending wallet disbursement fintech",
  fintech: "fintech payments lending wallet bank",
  pos: "pos card terminal emv sdk platform channels",
  experience: "experience role engineer years",
  education: "education university lagos degree",
  writing: "writing articles medium substack poetry",
};

function stem(w: string): string {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']s\b/g, "")
    .split(/[^a-z0-9.+#]+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

/* ---------------------------------------------------------------- index (built once) */

const K1 = 1.4;
const B = 0.7;
const docTokens = CHUNKS.map((c) => tokenize(c.t));
const avgLen = docTokens.reduce((n, d) => n + d.length, 0) / Math.max(docTokens.length, 1);
const df = new Map<string, number>();
const tfs = docTokens.map((tokens) => {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  return tf;
});
const idf = (t: string) => {
  const n = df.get(t) ?? 0;
  return Math.log(1 + (CHUNKS.length - n + 0.5) / (n + 0.5));
};

const KIND_BOOST: Partial<Record<Kind, number>> = { note: 1.3, "case-study": 1.1, medium: 1.05, substack: 1.05 };

export type Retrieved = { text: string; source: Source };

/**
 * The best chunks for a question, at most `perSource` from any one source so a
 * single CV can't crowd out everything else.
 */
export function retrieve(query: string, k = 8, perSource = 3): Retrieved[] {
  const raw = query.toLowerCase();
  const expanded = [raw, ...Object.entries(EXPAND).filter(([w]) => new RegExp(`\\b${w}\\b`).test(raw)).map(([, v]) => v)].join(" ");
  const terms = [...new Set(tokenize(expanded))];
  if (!terms.length) return [];

  // Exact two-word phrases from the question ("react native", "transactional
  // outbox") outrank the same words scattered through a chunk.
  const words = raw.split(/[^a-z0-9.+#]+/).filter((w) => w.length > 1 && !STOP.has(w));
  const phrases = words.slice(1).map((w, i) => `${words[i]} ${w}`);

  const scored = tfs
    .map((tf, i) => {
      const len = docTokens[i]?.length ?? 0;
      let score = 0;
      for (const t of terms) {
        const f = tf.get(t);
        if (!f) continue;
        score += idf(t) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * len) / avgLen)));
      }
      const text = CHUNKS[i]?.t.toLowerCase() ?? "";
      for (const p of phrases) if (text.includes(p)) score += 3;
      const kind = SOURCES[CHUNKS[i]?.s ?? 0]?.kind;
      return { i, score: score * (kind ? KIND_BOOST[kind] ?? 1 : 1) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const perSourceCount = new Map<number, number>();
  const out: Retrieved[] = [];
  for (const { i } of scored) {
    const chunk = CHUNKS[i];
    const source = chunk ? SOURCES[chunk.s] : undefined;
    if (!chunk || !source) continue;
    const used = perSourceCount.get(chunk.s) ?? 0;
    if (used >= perSource) continue;
    perSourceCount.set(chunk.s, used + 1);
    out.push({ text: chunk.t, source });
    if (out.length >= k) break;
  }
  return out;
}

/** Text of whole sources by id, for the always-present profile card. */
export function sourceText(id: string): string {
  const index = SOURCES.findIndex((s) => s.id === id);
  if (index < 0) return "";
  return CHUNKS.filter((c) => c.s === index)
    .map((c) => c.t.replace(/^\[[^\]]*\]\n/, ""))
    .join("\n");
}

export const corpusInfo = { generatedAt: corpus.generatedAt, sources: SOURCES.length, chunks: CHUNKS.length };
