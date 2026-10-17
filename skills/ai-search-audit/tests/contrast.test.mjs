// Every text and UI colour pair of the report passes WCAG AA in both themes (tools/contrast.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure, LITE_PAIRS } from "../tools/contrast.mjs";
import { CSS, CSS_EXTRA } from "../scripts/lib/css.mjs";

test("WCAG AA contrast for every token pair, light and dark", () => {
  const rows = measure(CSS + CSS_EXTRA, LITE_PAIRS);
  assert.ok(rows.length > 100);
  const bad = rows.filter((r) => !r.ok).map((r) => `${r.theme} ${r.fg} on ${r.bg} ${r.ratio}:1 < ${r.need}`);
  assert.deepEqual(bad, []);
});

test("light by default whatever the system prefers; dark only from the toggle or #theme=dark", () => {
  assert.ok(!(CSS + CSS_EXTRA).includes("prefers-color-scheme"));
  assert.match(/:root\{([^}]*)\}/.exec(CSS)[1], /color-scheme:light/);
  assert.match(CSS, /:root\[data-theme="dark"\]\{[^}]*color-scheme:dark/);
});
