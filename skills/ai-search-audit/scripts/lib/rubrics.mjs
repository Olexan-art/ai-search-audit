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
