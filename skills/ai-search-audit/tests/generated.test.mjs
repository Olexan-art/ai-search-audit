// "How generated the text sounds": the Vectorscope block at the bottom of this report, the writing
// patterns' one copy of PatternScope, and the report's third language.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildModel } from "../scripts/lib/model.mjs";
import { renderReport } from "../scripts/lib/report.mjs";
import { buildExport, renderMarkdown } from "../scripts/lib/outputs.mjs";
import * as own from "../scripts/lib/patterns.mjs";
import * as vendored from "../scripts/vendor/vectorscope/patterns.mjs";
import { computeGenerated, validateStyle } from "../scripts/vendor/vectorscope/generatedText.mjs";
import { CANNOT, UI } from "../scripts/lib/copy.mjs";
import { page, readingOf, section } from "./helpers.mjs";

const TEMPLATE = "In today's world, managing your finances has never been more important. When it comes to running a small business, every minute counts. It is worth noting that late payments hurt. We built a powerful solution that delivers a seamless experience. Our platform helps you stay organised. Our platform helps you save time. Our platform helps you get paid faster. At the end of the day, your business deserves a comprehensive platform that unlocks its full potential.";

async function modelWithBlock(style = null) {
  const r = await readingOf(page({ body: `<h2>Why it matters</h2><p>${TEMPLATE}</p>` + section("Pricing") }));
  const m = buildModel(r);
  const judged = style ? validateStyle(style(r.vs.passages), r.vs.passages) : null;
  m.generated = computeGenerated({ sections: r.facts.sections, passages: r.vs.passages, style: judged });
  return { r, m };
}

test("the writing patterns and the block run one copy of PatternScope", () => {
  assert.equal(own.analysePatterns, vendored.analysePatterns);
  assert.equal(own.scoreDocument, vendored.scoreDocument);
  assert.equal(own.DETECTOR_SET_VERSION, vendored.DETECTOR_SET_VERSION);
});

test("the block sits at the bottom, after every check, with the same score the writing patterns carry", async () => {
  const { m } = await modelWithBlock((ps) => ({ agent: "Claude Code", model: "m", passages: ps.map((p) => ({ passage: p.index, verdict: "generic", evidence: p.text.slice(0, 30) })) }));
  const out = renderReport(m);
  const at = out.indexOf('id="generated"');
  assert.ok(at > 0, "block rendered");
  assert.ok(at > out.indexOf('id="all-checks"') || out.indexOf('id="all-checks"') < 0, "after the checks");
  assert.ok(at < out.indexOf('id="info-strip"'), "before the closing notes");
  assert.equal(m.generated.page.score.value, m.modules.patterns.score.value, "one number for one text");
  assert.match(out, /Na ile tekst brzmi jak wygenerowany/);
  assert.match(out, /nie wykrywa autorstwa/);
  const md = renderMarkdown(m);
  assert.match(md, /## How generated the text sounds/);
  const ex = buildExport(m);
  assert.equal(ex.generatedText.judgement.generic.passages, m.generated.passages.length);
});

test("without style.json the block says the agent did not judge, never a guess", async () => {
  const { m } = await modelWithBlock();
  const out = renderReport(m);
  assert.match(out, /no style\.json was given/);
  assert.equal(buildExport(m).generatedText.judgement, null);
});

test("three report languages: the switch, the copy, the link tuples", async () => {
  const { m } = await modelWithBlock();
  const out = renderReport(m);
  assert.ok(out.includes('data-set-lang="pl"') && out.includes('class="l-pl" lang="pl"'));
  assert.ok(out.includes("lang=(en|uk|pl)"));
  for (const c of CANNOT) for (const link of c.links) assert.ok(link.length === 4 && /^https:/.test(link[2]) && link[3], `link ${link[0]}: [en, uk, href, pl]`);
  assert.ok(UI.langGroup[2] && UI.themeGroup[2]);
  // Every pair rendered has its Polish member: the helpers refuse a missing one, so rendering is the test.
  assert.ok(!/\[object Object\]|undefined<\/span>/.test(out));
});
