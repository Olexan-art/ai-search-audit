// The HTML report: self-contained (a CSP that blocks the network, nothing loaded from outside),
// page text escaped, both languages present, the Lite layout's sections in order, and no prose
// that belongs to the full version (no rule text, no fix directions). The Markdown and the JSON
// come from the same model.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildModel } from "../scripts/lib/model.mjs";
import { renderReport } from "../scripts/lib/report.mjs";
import { buildExport, renderMarkdown } from "../scripts/lib/outputs.mjs";
import { EXPORT_SCHEMA } from "../scripts/lib/version.mjs";
import { page, readingOf, section } from "./helpers.mjs";

const EVIL = `<img src=x onerror="alert(1)">`;
const html = page({ title: `Title ${EVIL}`, body: section(`Heading ${EVIL}`) + '<img src="a.png">' + section("Second") });

async function report() {
  const r = await readingOf(html);
  const m = buildModel(r);
  return { r, m, out: renderReport(m) };
}

test("a CSP that blocks every network request, and nothing loaded from outside", async () => {
  const { out } = await report();
  assert.match(out, /<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:">/);
  for (const m of out.matchAll(/\ssrc="([^"]*)"/g)) assert.ok(m[1].startsWith("data:"), `src ${m[1].slice(0, 40)}`);
  assert.ok(!/<link[^>]+rel="stylesheet"/.test(out));
  assert.ok(!/<script[^>]+src=/.test(out));
});

test("page text is escaped wherever it appears", async () => {
  const { out } = await report();
  assert.ok(!out.includes(EVIL));
  assert.ok(out.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"));
});

test("the 2.103 layout: headline, cards, the first three, the places, all checks folded, the notes, the footer", async () => {
  const { out } = await report();
  const order = ['id="verdict"', 'id="headline"', 'id="sev-counts"', 'id="see-first"', 'id="means"', 'id="review-first"', 'id="page-map"', 'id="all-checks"', 'id="status"', 'id="lc-bots"', 'id="lc-classic"', 'id="lc-langs"', 'id="lc-severity"', 'id="lc-text"', 'id="lc-strips"', 'id="all-findings"', 'id="cannot-see"', 'id="info-strip"', 'id="full-link"', 'class="foot"'];
  let at = -1;
  for (const id of order) {
    const i = out.indexOf(id);
    assert.ok(i > at, `${id} out of order`);
    at = i;
  }
  assert.equal((out.match(/<li class="tile /g) || []).length, 6);
  for (const q of ["Shown well in search?", "AI finds it?", "AI reads all of it?", "AI quotes it right?", "AI gets the brand right?", "Languages in order?"]) assert.ok(out.includes(q), q);
  assert.ok(!out.includes("Rich results &amp; markup"));
  assert.ok(out.includes('id="tile-brand"') && out.includes("no brand.json or reviews.json"), "the brand tile says it was not checked");
  assert.ok(out.includes('href="https://www.getlooploop.com"'));
  assert.match(out, /<img class="gll-mark gll-on-light" src="data:image\/webp;base64,/, "the real mark, inline, in the light blue");
  assert.match(out, /<img class="gll-mark gll-on-dark" src="data:image\/webp;base64,/, "and in the dark blue");
  assert.ok(out.includes("AI search that understands your business") && out.includes("AI пошук, який розуміє ваш бізнес"));
  assert.ok(out.includes("A schema of the document, not a screenshot of the page."));
});

test("all checks is one closed <details> holding the 35-cell checklist and every finding", async () => {
  const { m, out } = await report();
  const d = /<details class="allc" id="all-checks">([\s\S]*?)<\/details>\n<section class="info"/.exec(out);
  assert.ok(d, "a closed details, right before the notes");
  assert.equal((d[1].match(/id="cg-/g) || []).length, 35);
  assert.equal((out.match(/id="cg-/g) || []).length, 35, "the checklist is drawn once");
  for (const f of m.findings) assert.ok(d[1].includes(`id="pin-${f.id}"`), f.id);
  assert.ok(d[1].includes("Robot access · Google and Bing · Languages · Reading the text"));
});

test("both languages are in the file, and Lite carries no rule text and no fix directions", async () => {
  const { out } = await report();
  assert.ok(out.includes('class="l-uk" lang="uk"'));
  assert.ok(out.includes("Де на сторінці це знайдено"));
  assert.ok(!/What the rule says|Fix direction|Що каже правило|Напрям виправлення/.test(out));
  // The one quoted source on the page is the llms.txt note; every rule source is in the export.
  assert.ok(out.includes('id="llms-note"'));
  assert.ok(!out.replace(/<p class="capnote" id="llms-note">.*?<\/p>/s, "").includes("developers.google.com"), "rule sources are in the export, not on the Lite page");
});

test("the export: the schema id, every finding with its rule sources, the same pins as the report", async () => {
  const { m, out } = await report();
  const x = buildExport(m);
  assert.equal(x.schema, EXPORT_SCHEMA);
  assert.equal(x.findings.length, m.findings.length);
  for (const f of x.findings) {
    assert.ok(f.rules.length && f.rules.every((s) => s.url.startsWith("https://")), f.code);
    assert.ok(f.label.en && f.label.uk, f.code);
  }
  for (const f of m.findings) assert.ok(out.includes(`id="pin-${f.id}"`), f.id);
  const md = renderMarkdown(m);
  assert.ok(md.startsWith("# AI Search Audit Lite: https://example.org/page"));
  for (const f of m.findings) assert.ok(md.includes(`\`${f.code}\``), f.code);
});

test("light by default whatever the system prefers; dark only from the toggle or #theme=dark", async () => {
  const { out } = await report();
  assert.ok(!out.includes("prefers-color-scheme"), "the system preference does not pick the theme");
  assert.match(/:root\{([^}]*)\}/.exec(out)[1], /color-scheme:light/);
  assert.match(out, /:root\[data-theme="dark"\]\{[^}]*color-scheme:dark/);
  assert.ok(out.includes("theme=(dark|light)"), "#theme= still works");
  assert.match(out, /data-set-theme="dark" aria-pressed="false"/);
  assert.match(out, /data-set-theme="light" aria-pressed="true"/);
  assert.match(out, /prefers-reduced-motion:reduce/);
  assert.match(out, /:focus-visible/);
});

test("severity carries a shape and a word, not colour alone", async () => {
  const { out } = await report();
  // Every marker in a key, a chip or a bar row is a severity shape, and a severity word sits beside it.
  const pins = [...out.matchAll(/<svg class="pi pin (blocking|high|medium|low)"[^>]*>(<polygon|<circle|<rect)/g)];
  assert.ok(pins.length > 0);
  const pills = [...out.matchAll(/<span class="pill sp (\w+)">(<svg class="pi pin \1"[^>]*>[\s\S]*?<\/svg>)<span class="l-en">(\w+)<\/span>/g)];
  assert.ok(pills.length > 0, "severity pills: a shape and a word");
  const row = /<ul class="sevrow"[^>]*>([\s\S]*?)<\/ul>/.exec(out)[1];
  for (const s of ["blocking", "high", "medium", "low"]) assert.match(row, new RegExp(`<li class="${s}"><svg class="pi pin ${s}"[\\s\\S]*?<span class="l-en">\\d+ ${s}</span>`), s);
});

// ── 2.103: the summary ───────────────────────────────────────────────────────


test("the headline: reachable with the count of notes, in both languages, with the Ukrainian plural", async () => {
  const { m, out } = await report();
  const n = m.findings.length;
  assert.ok(n > 1);
  const h = /<h1 id="headline">([\s\S]*?)<\/h1>/.exec(out)[1];
  assert.ok(h.includes(`The page is reachable. ${n} notes.`), h);
  const uk = n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? "зауваження" : n % 10 === 1 && n % 100 !== 11 ? "зауваження" : "зауважень";
  assert.ok(h.includes(`Сторінка доступна. Є ${n} ${uk}.`), h);
  assert.ok(out.includes("The check found nothing that blocks robots."));
});

test("the headline names the block: noindex, and robots.txt", async () => {
  const { headline, subtitle } = await import("../scripts/lib/copy.mjs");
  const ni = headline([{ code: "noindex", severity: "blocking", area: "find" }, { code: "h1_missing", severity: "medium", area: "classic" }]);
  assert.equal(ni.blocked, true);
  assert.deepEqual(ni.t, ["The page asks search not to index it. 2 notes.", "Сторінка просить пошук не індексувати її. Є 2 зауваження.", "Strona prosi wyszukiwarki, by jej nie indeksowały. 2 uwagi."]);
  assert.ok(subtitle([{ code: "h1_missing", severity: "medium", area: "classic" }], true)[0].startsWith("Start with the block"));
  const r = await readingOf(html, {}, { robotsText: "User-agent: *\nDisallow: /\n" });
  const bm = buildModel(r);
  assert.ok(bm.findings.some((f) => f.code === "search_engine_blocked"));
  const out = renderReport(bm);
  assert.match(out, /<h1 id="headline"><span class="l-en">robots\.txt blocks search robots\. \d+ notes\.<\/span><span class="l-uk" lang="uk">robots\.txt блокує пошукових роботів\. Є \d+ /);
  assert.match(out, /class="lite-verdict is-blocked"|lite-verdict is-blocked/);
  assert.match(out, /<li class="card block" id="card-find">[\s\S]*?Robots are blocked[\s\S]*?Blocked: /);
  assert.deepEqual(headline([]).t, ["The page is reachable. No notes.", "Сторінка доступна. Зауважень немає.", "Strona jest dostępna. Brak uwag."]);
  assert.equal(headline([{ code: "x", severity: "low" }]).t[1], "Сторінка доступна. Є 1 зауваження.");
  assert.equal(headline(Array.from({ length: 5 }, () => ({ code: "x", severity: "low" }))).t[1], "Сторінка доступна. Є 5 зауважень.");
});

test("three cards: robots, the text, brand and questions, the third not checked without judgement files", async () => {
  const { out } = await report();
  const cards = [...out.matchAll(/<li class="card (ok|prob|block|na)" id="card-(\w+)">/g)].map((x) => [x[2], x[1]]);
  assert.deepEqual(cards.map((c) => c[0]), ["find", "text", "brand"]);
  assert.equal(cards[2][1], "na");
  assert.ok(out.includes("Not checked: no brand, reviews or questions file"));
  for (const id of ["find", "text", "brand"]) assert.match(out, new RegExp(`id="card-${id}"><span class="card-i"><svg`), id);
  assert.ok(out.includes('class="cards-note"'));
  assert.ok(!out.includes('class="bchip'), "the old chips are gone");
});

test("the first three: numbered rows with severity, layer, place and a button to the place", async () => {
  const { m, out } = await report();
  const rows = [...out.matchAll(/<li class="tr( jd)?" id="top-([^"]+)">([\s\S]*?)<\/li>(?=<li class="tr|<\/ol>)/g)];
  assert.equal(rows.length, Math.min(3, m.bigs.length));
  rows.forEach((r, i) => {
    const f = m.bigs[i];
    assert.equal(r[2], f.id);
    assert.match(r[3], new RegExp(`<span class="tn ${f.severity}" aria-hidden="true">${f.pin}</span>`));
    assert.match(r[3], /class="pill sp /);
    assert.match(r[3], /class="pill lp (ms|est)"/);
    assert.match(r[3], /class="tloc"/);
    if (f.layer === "judgement") assert.match(r[3], /<details class="tr-d"><summary/);
    else assert.match(r[3], /class="btn btn-out btn-sm tr-b" href="#(place|pin)-/);
  });
  // The place the first mapped finding is in is selected, server side, so the page reads without the script.
  const sel = /<li class="[^"]*\bsel\b[^"]*" id="place-([^"]+)"><button type="button" class="pr" data-place="\1" aria-pressed="true"/.exec(out);
  assert.ok(sel, "one place is selected");
  assert.equal((out.match(/aria-pressed="true" aria-controls="pd-/g) || []).length, 1);
  assert.ok(out.includes(`<div class="pd" id="pd-${sel[1]}">`), "its detail is shown; the others are hidden");
  assert.equal((out.match(/<div class="pd" id="pd-[^"]+">/g) || []).length, 1);
});

test("a question finding opens its examples and names the model, in the first three", async () => {
  const { buildModel: bm } = await import("../scripts/lib/model.mjs");
  const r = await readingOf(html);
  const m = bm(r);
  const q = { ...m.findings[0], id: "q-test", code: "question_missing", layer: "judgement", label: ["No answer: “Can I?”", "Без відповіді: «Чи можна?»"], evidence: { question: "Can I check a PDF?" }, judgement: { model: "Test model 2" }, zones: [], strip: null, pin: 1 };
  m.findings.unshift(q);
  m.bigs.unshift(q);
  const out = renderReport(m);
  const row = /<li class="tr jd" id="top-q-test">([\s\S]*?)<\/details><\/li>/.exec(out);
  assert.ok(row);
  assert.ok(row[1].includes("Examples of questions") && row[1].includes("“Can I check a PDF?”") && row[1].includes("Model: Test model 2"));
  assert.ok(row[1].includes("the agent&#39;s estimate, not a check of three assistants") || row[1].includes("the agent's estimate, not a check of three assistants"));
  assert.ok(row[1].includes('class="pill lp est"'));
});
