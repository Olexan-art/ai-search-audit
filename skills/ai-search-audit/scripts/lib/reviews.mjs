// Reviews: what the agent's model believes the brand is rated on twelve review platforms (the
// GetLoopLoop Reviewscope's registry, with hosts and scales), from its own knowledge and with
// "doesn't know" as an answer, plus one control platform that does not exist. A rating given for
// the control is a hallucination, and it says the model's other ratings here prove nothing. The
// page is then read for a source: a platform's name, a link to it, or rating markup.
//
// One model's view: the web Reviewscope asks three assistants.

import { validateIdentity } from "../vendor/vectorscope/judgement.mjs";

/** The twelve, in the order Reviewscope asks and draws them. `scale`: five or ten stars, or a count (upvotes). */
export const REVIEW_PLATFORMS = [
  { code: "g2", name: "G2", host: "g2.com", aliases: ["g2 crowd", "g2crowd"], scale: "five" },
  { code: "capterra", name: "Capterra", host: "capterra.com", aliases: [], scale: "five" },
  { code: "getapp", name: "GetApp", host: "getapp.com", aliases: ["get app"], scale: "five" },
  { code: "software_advice", name: "Software Advice", host: "softwareadvice.com", aliases: ["softwareadvice"], scale: "five" },
  { code: "gartner_peer_insights", name: "Gartner Peer Insights", host: "gartner.com", aliases: ["peer insights"], scale: "five" },
  { code: "trustradius", name: "TrustRadius", host: "trustradius.com", aliases: ["trust radius"], scale: "ten" },
  { code: "trustpilot", name: "Trustpilot", host: "trustpilot.com", aliases: ["trust pilot"], scale: "five" },
  { code: "producthunt", name: "Product Hunt", host: "producthunt.com", aliases: ["producthunt"], scale: "count" },
  { code: "clutch", name: "Clutch", host: "clutch.co", aliases: ["clutch.co"], scale: "five" },
  { code: "goodfirms", name: "GoodFirms", host: "goodfirms.co", aliases: ["good firms"], scale: "five" },
  { code: "app_store", name: "Apple App Store", host: "apps.apple.com", aliases: ["app store", "appstore"], scale: "five" },
  { code: "google_play", name: "Google Play", host: "play.google.com", aliases: ["play store", "google play store"], scale: "five" },
];

/**
 * The control: a review platform that does not exist, asked about as though it did. It is drawn
 * from this pool by the site's host, so every page and every run of one site meets the same
 * control, and the instructions never name it: a model told which platform is invented could not
 * be caught inventing a rating for it. The report always says which one it was.
 */
export const CONTROL_POOL = [
  { code: "vetteral", name: "Vetteral" },
  { code: "ratefold", name: "Ratefold" },
  { code: "proofwick", name: "Proofwick" },
  { code: "quillrate", name: "Quillrate" },
  { code: "peerhaven", name: "Peerhaven" },
  { code: "vouchwell", name: "Vouchwell" },
  { code: "trustorly", name: "Trustorly" },
  { code: "revunda", name: "Revunda" },
].map((p) => ({ ...p, host: null, aliases: [], scale: "five", control: true }));

const hashOf = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return h >>> 0;
};
const hostOf = (url) => {
  try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ""); } catch { return String(url || ""); }
};

/** The control platform for a page's site. */
export const controlFor = (url) => CONTROL_POOL[hashOf(hostOf(url)) % CONTROL_POOL.length];
/** The control when the site is not known (old files and tests). */
export const CONTROL = CONTROL_POOL[0];
/** The platforms a reviews.json for this control answers: the twelve, then the control. */
export const platformsFor = (control = CONTROL) => [...REVIEW_PLATFORMS, control];
export const ALL_PLATFORMS = platformsFor(CONTROL);
export const PLATFORM_CODES = ALL_PLATFORMS.map((p) => p.code);

/**
 * reviews.template.json for a site: every platform once, the control among them, in an order
 * shuffled by the host, and "knows" left empty, so the agent fills each one in and a file
 * copied without thought is refused.
 */
export function reviewsTemplate(url) {
  const host = hostOf(url);
  const platforms = platformsFor(controlFor(url))
    .map((p) => ({ p, k: hashOf(`${host}:${p.code}`) }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => ({ platform: p.code, name: p.name, scale: p.scale === "ten" ? "0-10" : p.scale === "count" ? "upvotes" : "0-5", knows: null }));
  return { agent: "<your agent>", model: "<your model name>", brand: "", basis: BASIS, platforms };
}
export const BASIS = "own_knowledge";
const MAX = { five: 5, ten: 10 };

/**
 * reviews.json:
 * {"agent": "…", "model": "…", "brand": "Name", "basis": "own_knowledge",
 *  "platforms": [{"platform": "g2", "knows": true, "rating": 4.5, "reviews": 120}, {"platform": "capterra", "knows": false}, …]}
 * Every platform of reviews.template.json once: the twelve and this site's control.
 * Returns { brand, platforms, control, judgement } or throws.
 */
export function validateReviews(input, control = CONTROL) {
  const ALL = platformsFor(control);
  const CODES = ALL.map((p) => p.code);
  if (!input || typeof input !== "object" || !Array.isArray(input.platforms)) throw new Error('reviews.json must be {"brand": "…", "basis": "own_knowledge", "platforms": [{"platform": "g2", "knows": false}, …]}.');
  if (input.basis !== BASIS) throw new Error(`reviews.json "basis" must be "${BASIS}": the ratings come from the model's own knowledge, with no browsing or search.`);
  const brand = typeof input.brand === "string" ? input.brand.replace(/\s+/g, " ").trim() : "";
  if (!brand || brand.length > 80) throw new Error('reviews.json "brand" must be the brand\'s name, 1–80 characters.');
  const seen = new Set();
  const platforms = input.platforms.map((x, i) => {
    const where = `platforms[${i}]`;
    if (!x || !CODES.includes(x.platform)) throw new Error(`${where}.platform must be one of the platforms in reviews.template.json (${CODES.join(", ")}).`);
    if (seen.has(x.platform)) throw new Error(`platform ${x.platform} appears twice.`);
    seen.add(x.platform);
    if (typeof x.knows !== "boolean") throw new Error(`${where}.knows must be true or false; false is the honest answer when the model does not know.`);
    const p = ALL.find((y) => y.code === x.platform);
    if (!x.knows) return { platform: p.code, knows: false, rating: null, reviews: null };
    const rating = x.rating;
    if (typeof rating !== "number" || !Number.isFinite(rating) || rating < 0) throw new Error(`${where}.rating must be a number when knows is true.`);
    if (p.scale === "count" ? !Number.isInteger(rating) : rating > MAX[p.scale]) throw new Error(`${where}.rating ${rating} is outside ${p.name}'s scale (${p.scale === "count" ? "a whole count of upvotes" : `0–${MAX[p.scale]}`}).`);
    const reviews = x.reviews === undefined || x.reviews === null ? null : x.reviews;
    if (reviews !== null && (!Number.isInteger(reviews) || reviews < 0)) throw new Error(`${where}.reviews must be a whole number or left out.`);
    return { platform: p.code, knows: true, rating, reviews };
  });
  const missing = CODES.filter((c) => !seen.has(c));
  if (missing.length) throw new Error(`reviews.json has no entry for ${missing.join(", ")}; every platform gets one, "knows": false included.`);
  platforms.sort((a, b) => CODES.indexOf(a.platform) - CODES.indexOf(b.platform));
  return { brand, platforms, control: { code: control.code, name: control.name }, judgement: validateIdentity(input) };
}

const fold = (s) => String(s ?? "").toLowerCase().replace(/[’']/g, "").replace(/\s+/g, " ");
const mentions = (text, p) => [p.name, ...p.aliases].some((n) => new RegExp(`(?:^|[^\\p{L}\\p{N}])${n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "u").test(text));

/** A visible rating: "4.8/5", "4,8 з 5", "4.8 out of 5", "4.8 stars", a row of stars, or a count of reviews. */
const VISIBLE_RATING = /(?:\b[0-5](?:[.,]\d)?\s*(?:\/\s*5\b|out of 5\b|з 5\b|de 5\b|stars?\b|зір|estrellas?\b))|★{3,}|\b\d[\d,. ]*\s+(?:reviews|ratings|відгук(?:ів|и)?|reseñas|valoraciones)\b/iu;
export const visibleRatingIn = (text) => {
  const m = String(text || "").match(VISIBLE_RATING);
  return m ? m[0].trim() : null;
};

/**
 * Findings. `page` is { text, links: [url], types: Set of schema types, zones: { text, zone } list }.
 * The markup check (reviews shown without rating markup) is measured and runs without reviews.json.
 */
export function reviewFindings(r, page) {
  const out = [];
  const text = fold(page.text);
  const hasRatingMarkup = ["AggregateRating", "Review"].some((t) => page.types.has(t)) || /"aggregaterating"|"@type":\s*"review"/i.test(page.jsonText || "");
  if (r) {
    const base = { judgement: r.judgement };
    const C = r.control || CONTROL;
    const control = r.platforms.find((p) => p.platform === C.code);
    if (control?.knows) out.push({ ...base, code: "review_control_hallucination", evidence: { platform: C.name, invented: true, rating: control.rating, reviews: control.reviews }, where: `control question · “${C.name}” (invented)` });
    const unbacked = [];
    for (const x of r.platforms.filter((p) => p.knows && p.platform !== C.code)) {
      const p = REVIEW_PLATFORMS.find((y) => y.code === x.platform);
      const linked = page.links.some((u) => {
        try {
          const h = new URL(u).hostname.replace(/^www\./, "");
          return h === p.host || h.endsWith(`.${p.host}`);
        } catch {
          return false;
        }
      });
      if (!mentions(text, p) && !linked && !hasRatingMarkup) unbacked.push({ platform: p.name, rating: x.rating, scale: p.scale, reviews: x.reviews });
    }
    if (unbacked.length) out.push({ ...base, code: "review_rating_unbacked", evidence: { count: unbacked.length, items: unbacked }, where: `review question${unbacked.length > 1 ? "s" : ""} · page text, links and JSON-LD` });
  }
  const shown = page.zones.map((z) => ({ zone: z.zone, hit: visibleRatingIn(z.text) })).filter((z) => z.hit);
  if (shown.length && !hasRatingMarkup) out.push({ code: "reviews_without_markup", evidence: { samples: shown.slice(0, 3).map((z) => z.hit), types: [...page.types].slice(0, 8) }, zones: [...new Set(shown.map((z) => z.zone))], strip: null, where: "visible rating · no AggregateRating" });
  return out;
}
