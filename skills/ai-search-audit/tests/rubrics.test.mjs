// The verifier rubrics (scripts/lib/rubrics.mjs): every rubric belongs to a registered code, every
// clause has a well-formed id, references/checks.md lists every clause by id with its own words,
// and the JSON export carries the rubric with the finding it belongs to.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CODES } from "../scripts/lib/checks.mjs";
import { RUBRICS } from "../scripts/lib/rubrics.mjs";
import { buildModel } from "../scripts/lib/model.mjs";
import { buildExport } from "../scripts/lib/outputs.mjs";
import { page, readingOf } from "./helpers.mjs";

const checksMd = readFileSync(new URL("../references/checks.md", import.meta.url), "utf8");

test("every rubric is for a registered code and has keep and drop clauses with unique ids", () => {
  const ids = new Set();
  for (const [code, r] of Object.entries(RUBRICS)) {
    assert.ok(CODES[code], `${code} is not a registered code`);
    assert.ok(r.keepWhen.length >= 1 && r.dropWhen.length >= 1, code);
    for (const [kind, list] of [["keep", r.keepWhen], ["drop", r.dropWhen]]) {
      list.forEach((c, i) => {
        assert.equal(c.id, `${code}:${kind}-${i + 1}`);
        assert.ok(!ids.has(c.id), c.id);
        ids.add(c.id);
        assert.ok(c.text.length >= 20 && c.text.endsWith("."), c.id);
      });
    }
  }
  for (const code of ["image_lcp_lazy", "hidden_headings", "nav_in_content", "script_render_blocking", "link_text_generic", "dominant_heading"]) assert.ok(RUBRICS[code], code);
});

test("references/checks.md lists every clause by its id, word for word", () => {
  for (const r of Object.values(RUBRICS)) {
    for (const c of [...r.keepWhen, ...r.dropWhen]) assert.ok(checksMd.includes(`\`${c.id}\` ${c.text}`), `${c.id} is not in references/checks.md as written`);
  }
});

test("the export carries the rubric with its finding, and no rubric where there is none", async () => {
  const r = await readingOf(page({ head: '<script src="/js/consent.js"></script>' }));
  const out = buildExport(buildModel(r));
  const f = out.findings.find((x) => x.code === "script_render_blocking");
  assert.deepEqual(f.rubric, RUBRICS.script_render_blocking);
  assert.ok(out.findings.filter((x) => !RUBRICS[x.code]).every((x) => x.rubric === undefined));
});
