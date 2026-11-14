// `audit.mjs --codes` and `--explain <code>`: every code has a title in three languages; the
// explanation names the code's sources and rubric; an unknown code exits 2. No network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { CODES } from "../scripts/lib/checks.mjs";
import { TITLES } from "../scripts/lib/titles.mjs";
import { codesText, explainText } from "../scripts/lib/explainCli.mjs";

const AUDIT = fileURLToPath(new URL("../scripts/audit.mjs", import.meta.url));
const run = (...args) => spawnSync(process.execPath, [AUDIT, ...args], { encoding: "utf8" });

test("every code has a title in English, Ukrainian and Polish", () => {
  for (const code of Object.keys(CODES)) {
    assert.ok(Array.isArray(TITLES[code]) && TITLES[code].length === 3 && TITLES[code].every((t) => t.trim()), code);
    assert.ok(!/[ыъэё]/i.test(TITLES[code][1]), code);
  }
  assert.deepEqual(Object.keys(TITLES).sort(), Object.keys(CODES).sort());
});

test("--codes lists every code with its title", () => {
  const r = run("--codes");
  assert.equal(r.status, 0);
  const lines = r.stdout.trim().split("\n");
  assert.equal(lines.length, Object.keys(CODES).length);
  assert.ok(lines.some((l) => l.startsWith("script_render_blocking") && l.includes(TITLES.script_render_blocking[0])));
  assert.ok(codesText("pl").includes(TITLES.hidden_headings[2]));
});

test("--explain prints the title, severity, every source and the rubric; --lang switches the words", () => {
  const r = run("--explain", "image_lcp_lazy");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^image_lcp_lazy · /);
  assert.ok(r.stdout.includes(TITLES.image_lcp_lazy[0]));
  assert.ok(r.stdout.includes("severity: medium"));
  assert.ok(r.stdout.includes("https://web.dev/articles/lcp-lazy-loading"));
  assert.ok(r.stdout.includes("optimize-image-priority.md"));
  assert.ok(r.stdout.includes("dropWhen image_lcp_lazy:drop-1"));
  const uk = run("--explain", "image_lcp_lazy", "--lang", "uk");
  assert.ok(uk.stdout.includes(TITLES.image_lcp_lazy[1]));
  assert.ok(!explainText("noindex", "en").includes("dropWhen"), "no rubric, none shown");
});

test("an unknown code or language exits 2 with a short message", () => {
  const r = run("--explain", "no_such_code");
  assert.equal(r.status, 2);
  assert.match(r.stderr, /unknown code: no_such_code/);
  assert.equal(run("--codes", "--lang", "xx").status, 2);
});
