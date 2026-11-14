#!/usr/bin/env node
// Step 2 of the AI Search Audit (Lite): every check over the reading, the agent's judgement files
// validated and compared with the page, and the report. No network, no model: the scripts only
// count, compare and draw; the judgement in questions.json, brand.json and reviews.json was
// written by the agent running the skill, and the report marks it as such.
//   node scripts/audit.mjs reading.json [--questions questions.json] [--brand brand.json] [--reviews reviews.json] [--style style.json]
//        [--keyword "phrase"] [--html report.html] [--md report.md] [--json export.json] [--check]
// --check validates the judgement files against the reading and writes nothing.
// A refused reading (ok:false) still gets its report: the URL and the reason, nothing else.

import { readFileSync, writeFileSync } from "node:fs";
import { buildModel } from "./lib/model.mjs";
import { renderRefusal, renderReport } from "./lib/report.mjs";
import { buildExport, buildRefusalExport, renderMarkdown, renderRefusalMarkdown } from "./lib/outputs.mjs";
import { READING_SCHEMA, SKILL_VERSION } from "./lib/version.mjs";
import { checkForUpdate, NO_UPDATE_FLAG, updateLine, updateNotice } from "./lib/update-check.mjs";
import { validateQuestions } from "./lib/questions.mjs";
import { validateBrand } from "./lib/brand.mjs";
import { controlFor, validateReviews } from "./lib/reviews.mjs";
import { textModules } from "./lib/checks.mjs";
import { computeGenerated, validateStyle } from "./vendor/vectorscope/generatedText.mjs";
import { validateDrops } from "./lib/rubrics.mjs";
import { codesText, EXPLAIN_LANGS, explainText, isCode } from "./lib/explainCli.mjs";

const USAGE = [
  "Usage: node scripts/audit.mjs reading.json [--questions questions.json] [--brand brand.json] [--reviews reviews.json] [--style style.json]",
  '       [--keyword "phrase"] [--drops drops.json] [--html report.html] [--md report.md] [--json export.json] [--check]',
  "   or: node scripts/audit.mjs --codes [--lang en|uk|pl]          every finding code with its title",
  "   or: node scripts/audit.mjs --explain <code> [--lang en|uk|pl]  what one code means, its sources and its rubric",
  "   --no-update-check (or GETLOOPLOOP_NO_UPDATE_CHECK=1) skips the daily check for a newer version.",
].join("\n");

function parseArgs(argv) {
  const out = { reading: null, html: null, md: null, json: null, questions: null, brand: null, reviews: null, style: null, keyword: null, check: false };
  const takes = { "--html": "html", "--md": "md", "--json": "json", "--questions": "questions", "--brand": "brand", "--reviews": "reviews", "--style": "style", "--drops": "drops", "--explain": "explain", "--lang": "lang", "--keyword": "keyword" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (takes[arg]) {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${arg} needs a value`);
      out[takes[arg]] = v;
    } else if (arg === "--check") out.check = true;
    else if (arg === "--codes") out.codes = true;
    else if (arg === "-h" || arg === "--help") out.help = true;
    else if (arg === NO_UPDATE_FLAG) out.noUpdateCheck = true;
    else if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    else if (!out.reading) out.reading = arg;
    else throw new Error(`One reading only; also given: ${arg}`);
  }
  return out;
}

let args;
try {
  args = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  console.error(USAGE);
  process.exit(1);
}
// --codes and --explain: what the codes mean, with no reading and no network.
if (args.codes || args.explain) {
  const lang = args.lang || "en";
  if (!EXPLAIN_LANGS.includes(lang)) {
    console.error(`--lang must be one of ${EXPLAIN_LANGS.join(", ")}`);
    process.exit(2);
  }
  if (args.explain && !isCode(args.explain)) {
    console.error(`unknown code: ${args.explain}. List them with --codes.`);
    process.exit(2);
  }
  console.log(args.explain ? explainText(args.explain, lang) : codesText(lang));
  process.exit(0);
}
if (args.help || !args.reading) {
  console.error(USAGE);
  process.exit(args.help ? 0 : 1);
}
if (!args.check && !args.html && !args.md && !args.json) args.html = "report.html";
// At most one GET of plugin.json on GitHub a day, about 2 seconds at worst, silent on failure.
const update = args.check || args.noUpdateCheck ? null : await checkForUpdate({ repo: "ai-search-audit", plugin: "ai-search-audit", current: SKILL_VERSION });
if (update) {
  update.notice = updateNotice(update);
  console.error(updateLine(update));
}

const readJson = (file, what) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`REFUSED   ${file} is not a readable JSON file (${what}): ${error.message}`);
    process.exit(1);
  }
};

const reading = readJson(args.reading, "reading");
if (reading.schema !== READING_SCHEMA) {
  console.error(`REFUSED   ${args.reading} is not an ai-search-audit reading (schema ${JSON.stringify(reading.schema)}, expected ${READING_SCHEMA}). Run read.mjs first.`);
  process.exit(1);
}

if (!reading.ok) {
  if (args.check) {
    console.log(`REFUSED   ${reading.reasonCode}: the reading was refused, so there is nothing to judge.`);
    process.exit(2);
  }
  if (args.html) writeFileSync(args.html, renderRefusal(reading));
  if (args.md) writeFileSync(args.md, renderRefusalMarkdown(reading));
  if (args.json) writeFileSync(args.json, JSON.stringify(buildRefusalExport(reading), null, 2));
  console.log(`REFUSED   ${reading.reasonCode}${reading.status ? ` (HTTP ${reading.status})` : ""}`);
  for (const [k, v] of [["html", args.html], ["md", args.md], ["json", args.json]]) if (v) console.log(`${k.padEnd(9)} ${v}`);
  process.exit(2);
}

// The judgement files: each one validated against this reading, or the run stops and says what to fix.
const extra = { keyword: args.keyword };
const modules = textModules(reading, { keyword: args.keyword });
const judged = [
  ["questions", args.questions, (x) => validateQuestions(x, reading.vs.passages, { keyword: modules.keyword.keyword })],
  ["brand", args.brand, validateBrand],
  ["reviews", args.reviews, (x) => validateReviews(x, controlFor(reading.fetch?.finalUrl || reading.requestedInput))],
  ["style", args.style, (x) => validateStyle(x, reading.vs.passages)],
];
for (const [key, file, validate] of judged) {
  if (!file) continue;
  try {
    extra[key] = validate(readJson(file, key));
  } catch (error) {
    console.error(`REFUSED   ${file}: ${error.message}`);
    process.exit(1);
  }
  for (const w of extra[key].warnings || []) console.log(`warning   ${file}: ${w}`);
  const j = extra[key].judgement;
  console.log(`${key.padEnd(9)} ${file} ok · judged by ${j.agent || "agent not stated"} · ${j.model || "model not stated"}`);
}
// drops.json: checked against the findings of this very audit, so it is read after the others.
if (args.drops) {
  try {
    extra.drops = validateDrops(readJson(args.drops, "drops"), buildModel(reading, extra).findings);
  } catch (error) {
    console.error(`REFUSED   ${args.drops}: ${error.message}`);
    process.exit(1);
  }
  const j = extra.drops.judgement;
  console.log(`drops     ${args.drops} ok · ${extra.drops.drops.length} dropped · judged by ${j.agent || "agent not stated"} · ${j.model || "model not stated"}`);
}
if (args.check) process.exit(0);

const model = buildModel(reading, extra);
model.update = update;
// How generated the text sounds: the writing patterns' own text (the kept sections), each passage, the swap test.
model.generated = computeGenerated({ sections: reading.facts.sections || null, passages: reading.vs.passages, style: extra.style ?? null });
if (args.html) writeFileSync(args.html, renderReport(model));
if (args.md) writeFileSync(args.md, renderMarkdown(model));
if (args.json) writeFileSync(args.json, JSON.stringify(buildExport(model), null, 2));

const c = model.counts;
console.log(`url       ${reading.fetch.finalUrl}`);
console.log(`problems  ${model.findings.length} · blocking ${c.blocking} · high ${c.high} · medium ${c.medium} · low ${c.low}`);
console.log(`tiles     ${model.tiles.map((t) => `${t.id} ${t.state}`).join(" · ")}`);
if (model.keyword) console.log(`keyword   “${model.keyword.keyword}” (${model.keyword.source === "given" ? "--keyword" : "from the h1"})`);
const p = model.modules.patterns;
console.log(`patterns  ${p.analysed ? `${p.language} · ${p.wordCount} words · ${p.findings.length} signals` : `not analysed (${p.reason})`}`);
const gx = model.generated;
console.log(`generated ${gx.page?.score ? `pattern score ${gx.page.score.value}/100 ${gx.page.score.band}` : `pattern score not computed (${gx.reason})`}${gx.page ? ` · markers ${gx.page.markers.perThousand}/1k` : ""} · ${gx.judged ? `${gx.generic.passages} of ${gx.generic.of} passages generic` : "swap test not given (--style)"}`);
if (model.modules.locales) console.log(`locales   ${model.modules.locales.compared.map((x) => `${x.hreflang} ${x.aligned ? `${x.differ} differ` : "not aligned"}`).join(" · ")}`);
if (model.dropped.length) console.log(`dropped   ${model.dropped.map((f) => `${f.code} (${f.drop.clause})`).join(" · ")}`);
for (const f of model.findings) console.log(`  ${String(f.pin).padStart(2)} [${f.severity}] ${f.code}${f.layer === "judgement" ? " (judgement)" : ""}${f.where ? `  @ ${f.where.slice(0, 90)}` : ""}`);
const cl = model.checklist;
console.log(`checklist ${["pass", "fail", "warn", "na", "none"].map((s) => `${s} ${cl.filter((x) => x.state === s).length}`).join(" · ")}`);
for (const cap of model.caps) console.log(`not done  ${cap.t[0]}`);
for (const [k, v] of [["html", args.html], ["md", args.md], ["json", args.json]]) if (v) console.log(`${k.padEnd(9)} ${v}`);
