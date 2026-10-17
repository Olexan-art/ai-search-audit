// 2.108: the site-level refusals, through the audit's own read: a Russian domain zone and hosting
// in Russia refuse before the page is fetched, a Russian-language version of the site after it.
// The rules are the Vectorscope's (vendor/vectorscope/russianSite.mjs); this checks the wiring,
// the reading and the report. No network: fetch, DNS and RDAP are stubbed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readAudit } from "../scripts/lib/reading.mjs";
import { renderRefusal } from "../scripts/lib/report.mjs";
import { buildRefusalExport, renderRefusalMarkdown } from "../scripts/lib/outputs.mjs";
import { esc } from "../scripts/vendor/vectorscope/html.mjs";
import { REFUSAL_CODES, REFUSAL_REASON } from "../scripts/vendor/vectorscope/refusal.mjs";
import { hostingDeps, page, withFetch } from "./helpers.mjs";

const SECRET = "A sentence that only this page carries, and the report must never show.";
const noDeps = { lookup: async () => assert.fail("DNS must not be asked"), fetch: async () => assert.fail("RDAP must not be asked") };

test("a .ru address is refused before any request: no page, no DNS, no RDAP", async () => {
  const calls = await withFetch({}, async (c) => {
    const r = await readAudit({ url: "https://shop.example.ru/page", deps: noDeps });
    assert.equal(r.ok, false);
    assert.equal(r.reasonCode, "refused_ru_domain");
    assert.deepEqual([r.refusal.signal, r.refusal.zone], ["domain", "ru"]);
    return c;
  });
  assert.equal(calls.length, 0);
  for (const url of ["https://a.su/", "https://пример.рф/", "https://a.moscow/", "https://сайт.москва/"]) {
    assert.equal((await readAudit({ url, deps: noDeps })).reasonCode, "refused_ru_domain", url);
  }
});

test("a site hosted in Russia is refused before its page is fetched", async () => {
  const seen = [];
  const calls = await withFetch({ "https://example.org/page": { body: page({ body: `<p>${SECRET}</p>` }) } }, async (c) => {
    const r = await readAudit({ url: "https://example.org/page", deps: hostingDeps("RU", seen) });
    assert.equal(r.reasonCode, "refused_ru_hosting");
    assert.deepEqual(r.hosting, { status: "checked", country: "RU", ip: "192.0.2.10" });
    return c;
  });
  assert.equal(calls.length, 0, "the page itself is not fetched");
  assert.deepEqual(seen, [{ dns: "example.org" }, { rdap: "https://rdap.org/ip/192.0.2.10" }]);
});

test("a Russian-language version of the site refuses after the fetch; nothing of the page is kept", async () => {
  const cases = [
    [{ head: '<link rel="alternate" hreflang="ru" href="https://example.org/ru/page">' }, {}, "hreflang"],
    [{ head: '<meta property="og:locale:alternate" content="ru_RU">' }, {}, "og_locale"],
    [{ body: `<p>${SECRET}</p>` }, { "content-language": "ru-RU" }, "content_language"],
  ];
  for (const [parts, headers, kind] of cases) {
    const r = await withFetch({ "https://example.org/page": { body: page({ body: `<p>${SECRET}</p>`, ...parts }), headers } }, () => readAudit({ url: "https://example.org/page", deps: hostingDeps("US") }));
    assert.equal(r.reasonCode, "refused_ru_audience", kind);
    assert.equal(r.refusal.signals[0].kind, kind);
    assert.equal(r.hosting.country, "US");
    assert.ok(!JSON.stringify(r).includes(SECRET), kind);
  }
});

test("links to a Russian version are not a declaration: a switcher to /ru, a ru. subdomain, <a lang=\"ru\"> do not refuse", async () => {
  for (const link of ['<nav><a href="/ru/page">RU</a></nav>', '<a href="https://ru.example.org/">RU</a>', '<a href="/x" lang="ru" hreflang="ru">x</a>']) {
    const r = await withFetch({ "https://example.org/page": { body: page({ body: `<p>${"Words here. ".repeat(40)}</p>${link}` }) } }, () => readAudit({ url: "https://example.org/page", network: false, deps: hostingDeps("US") }));
    assert.equal(r.ok, true, link);
  }
});

test("hosting not determined does not refuse, and the reading says so; a saved page is not checked", async () => {
  const r = await withFetch({ "https://example.org/page": { body: page({ body: `<p>${"Words here. ".repeat(40)}</p>` }) } }, () => readAudit({ url: "https://example.org/page", network: false, deps: hostingDeps(null) }));
  assert.equal(r.ok, true);
  assert.deepEqual(r.hosting, { status: "not_determined", ip: "192.0.2.10" });
  const saved = await readAudit({ url: "https://example.org/page", html: page({ body: "<p>Saved.</p>" }), finalUrl: "https://example.org/page", deps: noDeps });
  assert.deepEqual(saved.hosting, { status: "not_checked" });
});

test("the report: the same refusal block with one reason line, EN and UK, and no other-language line", () => {
  for (const code of REFUSAL_CODES) {
    const reading = { ok: false, reasonCode: code, refusal: { reasonCode: code, signal: "x" }, requestedInput: "https://example.org/x", page: { url: "https://example.org/x", requestedUrl: "https://example.org/x" } };
    const html = renderRefusal(reading);
    assert.ok(html.includes(esc(REFUSAL_REASON[code].en)) && html.includes(esc(REFUSAL_REASON[code].uk)), code);
    assert.ok(html.includes('class="refusal"') && html.includes("This page was not analysed"), code);
    const md = renderRefusalMarkdown(reading);
    assert.ok(md.includes(REFUSAL_REASON[code].en), code);
    for (const text of [html, md]) assert.ok(!/another language|іншою мовою|class="last"/.test(text), code);
    assert.equal(buildRefusalExport(reading).refusal.reasonCode, code);
  }
});
