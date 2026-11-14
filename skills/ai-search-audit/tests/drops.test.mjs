// drops.json: the agent sets a finding aside only by citing a dropWhen clause of the rubric for its
// code. A valid drop leaves the problem list and appears in its own group (HTML, Markdown, export);
// an unknown finding, a code with no rubric or a clause of another code are refused, all at once.
// No drops: the report is the same as before.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildModel } from "../scripts/lib/model.mjs";
import { renderReport } from "../scripts/lib/report.mjs";
import { buildExport, renderMarkdown } from "../scripts/lib/outputs.mjs";
import { validateDrops, RUBRICS } from "../scripts/lib/rubrics.mjs";
import { page, readingOf } from "./helpers.mjs";

const html = page({ head: '<script src="/js/consent.js"></script>' });
const drop = { finding: "script_render_blocking", clause: "script_render_blocking:drop-1", note: "The only blocking script is the consent manager." };

test("a valid drop leaves the problems and is shown in its own group, with clause and note", async () => {
  const r = await readingOf(html);
  const base = buildModel(r);
  assert.ok(base.findings.some((f) => f.code === "script_render_blocking"));
  const drops = validateDrops({ agent: "Claude Code", model: "test-model", drops: [drop] }, base.findings);
  const m = buildModel(r, { drops });
  assert.ok(!m.findings.some((f) => f.code === "script_render_blocking"), "not a problem any more");
  assert.equal(m.findings.length, base.findings.length - 1);
  assert.equal(m.counts.low, base.counts.low - 1);
  const out = renderReport(m);
  const at = out.indexOf('id="dropped"');
  assert.ok(at > 0);
  const g = out.slice(at, out.indexOf("</details>", at));
  assert.ok(g.includes("Dropped by the agent") && g.includes("Відкинуто агентом") && g.includes("Odrzucone przez agenta"));
  assert.ok(g.includes("script_render_blocking:drop-1") && g.includes(RUBRICS.script_render_blocking.dropWhen[0].text) && g.includes(drop.note));
  const exp = buildExport(m);
  assert.equal(exp.counts.dropped, 1);
  assert.deepEqual(exp.dropped.map((d) => [d.code, d.clause, d.note]), [["script_render_blocking", drop.clause, drop.note]]);
  assert.ok(renderMarkdown(m).includes("## Dropped by the agent (1)"));
});

test("an unknown finding, a code without a rubric and a clause of another code are refused, every problem at once", async () => {
  const findings = buildModel(await readingOf(page({ head: '<script src="/js/a.js"></script>', omit: ["viewport"] }))).findings;
  assert.ok(findings.some((f) => f.code === "viewport_missing"));
  const bad = {
    drops: [
      { finding: "no_such_finding", clause: "x:drop-1", note: "n" },
      { finding: "viewport_missing", clause: "viewport_missing:drop-1", note: "n" },
      { finding: "script_render_blocking", clause: "image_lcp_lazy:drop-1", note: "n" },
    ],
  };
  assert.throws(
    () => validateDrops(bad, findings),
    (e) => /^3 problems:/.test(e.message) && /no_such_finding/.test(e.message) && /viewport_missing has no rubric/.test(e.message) && /not a dropWhen clause of script_render_blocking/.test(e.message),
  );
  assert.throws(() => validateDrops({ drops: [{ ...drop, note: "Примітка агента." }] }, findings), /English/);
  assert.throws(() => validateDrops({ drops: [drop, drop] }, findings), /dropped twice/);
  assert.throws(() => validateDrops({ nope: 1 }, findings), /drops\.json must be/);
});

test("no drops: the report and export are what they were", async () => {
  const m = buildModel(await readingOf(html));
  assert.deepEqual(m.dropped, []);
  assert.ok(!renderReport(m).includes('id="dropped"'));
  const exp = buildExport(m);
  assert.deepEqual(exp.dropped, []);
  assert.equal(exp.counts.dropped, 0);
});

test("audit.mjs refuses a bad drops.json with exit 1, and accepts a good one", async () => {
  const dir = mkdtempSync(join(tmpdir(), "drops-"));
  const readingFile = join(dir, "reading.json");
  writeFileSync(readingFile, JSON.stringify(await readingOf(html)));
  const audit = fileURLToPath(new URL("../scripts/audit.mjs", import.meta.url));
  writeFileSync(join(dir, "bad.json"), JSON.stringify({ drops: [{ finding: "script_render_blocking", clause: "nope", note: "n" }] }));
  const bad = spawnSync(process.execPath, [audit, readingFile, "--drops", join(dir, "bad.json"), "--check"], { encoding: "utf8" });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /REFUSED {3}.*bad\.json: 1 problem: drops\[0\]\.clause "nope" is not a dropWhen clause/);
  writeFileSync(join(dir, "good.json"), JSON.stringify({ agent: "Claude Code", drops: [drop] }));
  const good = spawnSync(process.execPath, [audit, readingFile, "--drops", join(dir, "good.json"), "--json", join(dir, "e.json")], { encoding: "utf8" });
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /drops {5}.*1 dropped/);
  rmSync(dir, { recursive: true, force: true });
});
