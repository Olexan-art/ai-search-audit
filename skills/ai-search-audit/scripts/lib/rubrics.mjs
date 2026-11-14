// Verifier rubrics for the checks most likely to fire on a page that is fine. A script sees markup,
// not intent: a lazy logo is not a lazy hero, and a consent manager blocks on purpose. Each rubric
// lists the clauses under which a finding stands (keepWhen) and the clauses under which a reader of
// the page would set it aside (dropWhen), so the agent explaining a finding can say which one it
// believes holds, by its id, instead of arguing from nothing.
//
// The rubric never removes a finding: the script still reports every one, and the report shows it.
// An agent that thinks a dropWhen clause holds names the clause id when it tells the user. The
// clauses are this skill's own.
//
// Ids are `<code>:keep-N` and `<code>:drop-N`; references/checks.md lists every clause by its id,
// and tests/rubrics.test.mjs holds the two together.

const R = (code, keep, drop) => ({
  keepWhen: keep.map((text, i) => ({ id: `${code}:keep-${i + 1}`, text })),
  dropWhen: drop.map((text, i) => ({ id: `${code}:drop-${i + 1}`, text })),
});

export const RUBRICS = {
  image_lcp_lazy: R(
    "image_lcp_lazy",
    [
      "The lazy image is the first content image people see at the top of the page: a hero, a product photo, an article's lead image.",
      "The image is large enough to be the largest element on the first screen.",
    ],
    [
      "The image is a logo, an icon or an avatar, smaller than the text beside it, so it cannot be the largest element.",
      "The image is in a carousel slide, a tab or a menu that is not shown when the page loads.",
      "A larger element clearly fills the first screen instead: a text block, a video poster, a CSS background.",
    ],
  ),
  hidden_headings: R(
    "hidden_headings",
    [
      "The hidden panel holds content the page is about: product details, a comparison, FAQ answers, a tab of specifications.",
      'The panel is hidden with the hidden attribute, aria-hidden="true" or an inline display:none, not with hidden="until-found" or a closed <details> (those are not reported).',
    ],
    [
      "The panel repeats content that is visible elsewhere on the page, such as a mobile copy of a desktop table.",
      "The panel is a dialog, a form step, a confirmation or an error message that only matters after an action.",
      "The headings label an off-canvas menu, a cookie panel or another piece of furniture, not content.",
    ],
  ),
  nav_in_content: R(
    "nav_in_content",
    ["The short lines are menu items, tag lists, breadcrumbs, share buttons or link lists inside the main text."],
    [
      "The short lines are content the page is about: product names, specifications, a list of values.",
      "The short lines are verse, lyrics, an address block or code.",
    ],
  ),
  script_render_blocking: R(
    "script_render_blocking",
    ["The script is a library, a widget, analytics, a chat or a framework bundle that does not have to run before the first paint."],
    [
      "The script is a consent manager that must run before any other tag loads.",
      "The script is an anti-flicker A/B-testing snippet that keeps the page hidden until the variant is applied.",
      "The script sets the colour theme or the language before the first paint, so the page does not flash in the wrong one.",
    ],
  ),
  link_text_generic: R(
    "link_text_generic",
    ['The link text alone ("here", "read more") names nothing, and the sentence, list item or table cell around it does not name the target either.'],
    ["The sentence, list item or table cell that holds the link names its target, which WCAG 2.4.4 (link purpose in context) accepts."],
  ),
  dominant_heading: R(
    "dominant_heading",
    ["The text under the heading covers several subtopics, each of which could answer a question of its own."],
    [
      "The section is one continuous topic (a single procedure, a story, a legal text) that subheadings would cut apart.",
      "The page is short and holds one answer by design, such as a definition.",
    ],
  ),
};

/** The rubric of a code, or null. */
export const rubricOf = (code) => RUBRICS[code] || null;

// ── drops.json: the agent sets a finding aside by citing one dropWhen clause ──

const MAX_NOTE_CHARS = 200;
const MAX_NAME_CHARS = 60;

/**
 * Validates drops.json against this audit's findings:
 *   {"agent": "…", "model": "…", "drops": [{"finding": "<code>", "clause": "<code>:drop-N", "note": "…"}]}
 * A drop must name a finding of this audit (its code or id), a code that has a rubric, and one of
 * that code's dropWhen clause ids, with a one-sentence English note. Every problem is listed at
 * once; a file with any problem is refused whole. The dropped findings are never deleted: the
 * report shows them in their own group, with the clause and the note.
 */
export function validateDrops(input, findings) {
  if (!input || typeof input !== "object" || !Array.isArray(input.drops)) throw new Error('drops.json must be {"agent": "…", "model": "…", "drops": [{"finding": "<code>", "clause": "<code>:drop-N", "note": "one sentence"}]}.');
  const byKey = new Map();
  for (const f of findings) {
    byKey.set(f.code, f);
    if (f.id) byKey.set(f.id, f);
  }
  const problems = [];
  const name = (k) => (input[k] === undefined || input[k] === null ? null : typeof input[k] === "string" && input[k].trim() && input[k].length <= MAX_NAME_CHARS ? input[k].trim() : (problems.push(`${k} must be a string of at most ${MAX_NAME_CHARS} characters`), null));
  const judgement = { agent: name("agent"), model: name("model") };
  const seen = new Set();
  const drops = [];
  input.drops.forEach((d, i) => {
    const where = `drops[${i}]`;
    if (!d || typeof d !== "object") return problems.push(`${where} is not an object`);
    const f = typeof d.finding === "string" ? byKey.get(d.finding.trim()) : null;
    if (!f) return problems.push(`${where}.finding ${JSON.stringify(d.finding)} is not a finding of this audit`);
    const rubric = RUBRICS[f.code];
    if (!rubric) return problems.push(`${where}: ${f.code} has no rubric, so it cannot be dropped`);
    const clause = rubric.dropWhen.find((c) => c.id === d.clause);
    if (!clause) return problems.push(`${where}.clause ${JSON.stringify(d.clause)} is not a dropWhen clause of ${f.code} (${rubric.dropWhen.map((c) => c.id).join(", ")})`);
    const note = typeof d.note === "string" ? d.note.trim().replace(/\s+/g, " ") : "";
    if (!note || note.length > MAX_NOTE_CHARS) problems.push(`${where}.note must be one short sentence of 1 to ${MAX_NOTE_CHARS} characters`);
    else if (/[Ѐ-ӿ]/.test(note)) problems.push(`${where}.note must be written in English`);
    if (seen.has(f.code)) problems.push(`${where}: ${f.code} is dropped twice`);
    seen.add(f.code);
    drops.push({ finding: f.id || f.code, code: f.code, clause: clause.id, clauseText: clause.text, note });
  });
  if (problems.length) throw new Error(`${problems.length} problem${problems.length === 1 ? "" : "s"}: ${problems.join("; ")}.`);
  return { judgement, drops, warnings: [] };
}
