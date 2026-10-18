// The control platform is drawn by the site's host and never named in the instructions: the
// template carries it among the real platforms, and a rating given for it is still caught.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTROL_POOL, REVIEW_PLATFORMS, controlFor, reviewsTemplate, validateReviews } from "../scripts/lib/reviews.mjs";

const fill = (template, extra = {}) => ({ ...template, brand: "Acme", agent: "Test", model: "Test", platforms: template.platforms.map((p) => ({ platform: p.platform, knows: false, ...(extra[p.platform] || {}) })) });

test("one site meets one control, from the pool, whatever the page", () => {
  const a = controlFor("https://www.example.com/pricing");
  assert.equal(controlFor("https://example.com/"), a);
  assert.ok(CONTROL_POOL.includes(a));
  assert.ok(new Set(["a.com", "b.org", "c.net", "d.io", "e.dev", "f.app"].map((h) => controlFor(`https://${h}/`).code)).size > 1, "different sites meet different controls");
});

test("the template lists every platform once, the control among them, with knows left empty", () => {
  const t = reviewsTemplate("https://example.com/");
  assert.equal(t.platforms.length, REVIEW_PLATFORMS.length + 1);
  assert.ok(t.platforms.some((p) => p.platform === controlFor("https://example.com/").code));
  assert.ok(t.platforms.every((p) => p.knows === null));
  assert.ok(!JSON.stringify(t).includes("control"), "nothing in the template says which one is invented");
  assert.throws(() => validateReviews({ ...t, brand: "Acme" }, controlFor("https://example.com/")), /knows must be true or false/);
});

test("a rating for this site's control is kept as the control; another site's control is refused", () => {
  const url = "https://example.com/";
  const control = controlFor(url);
  const r = validateReviews(fill(reviewsTemplate(url), { [control.code]: { knows: true, rating: 4.1 } }), control);
  assert.deepEqual(r.control, { code: control.code, name: control.name });
  assert.equal(r.platforms.find((p) => p.platform === control.code).rating, 4.1);
  const other = CONTROL_POOL.find((p) => p !== control);
  const wrong = fill(reviewsTemplate(url));
  wrong.platforms.find((p) => p.platform === control.code).platform = other.code;
  assert.throws(() => validateReviews(wrong, control), /reviews\.template\.json/);
});
