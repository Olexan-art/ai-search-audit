// A newer release found by the daily check (scripts/lib/update-check.mjs) reaches the report's
// header in all three languages, the Markdown, and the export as { current, latest, how }.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildModel } from "../scripts/lib/model.mjs";
import { renderReport } from "../scripts/lib/report.mjs";
import { buildExport, renderMarkdown } from "../scripts/lib/outputs.mjs";
import { updateHow, updateNotice, updateRoutes } from "../scripts/lib/update-check.mjs";
import { page, readingOf } from "./helpers.mjs";

const routes = updateRoutes({ repo: "example-repo", plugin: "example-skill" });
const update = { current: "2.111", latest: "2.200.0", how: updateHow(routes), routes, plugin: "example-skill" };
update.notice = updateNotice(update);

test("a newer release: a notice in the header, a Markdown line and the export field", async () => {
  const model = buildModel(await readingOf(page()));
  model.update = update;
  const html = renderReport(model);
  const header = html.slice(html.indexOf('id="verdict"'), html.indexOf("</header>", html.indexOf('id="verdict"')));
  assert.match(header, /class="lite-meta update"/);
  assert.ok(header.includes("2.200.0") && header.includes("Доступна новіша версія") && header.includes("Dostępna jest nowsza wersja"));
  assert.ok(renderMarkdown(model).includes("A newer version of this skill is available: 2.200.0"));
  assert.deepEqual(buildExport(model).update, { current: "2.111", latest: "2.200.0", how: update.how });
});

test("no newer release: no notice and update is null", async () => {
  const model = buildModel(await readingOf(page()));
  assert.ok(!renderReport(model).includes('class="lite-meta update"'));
  assert.equal(buildExport(model).update, null);
});

test("the footer links to GLLmolfar with its own icon inline, this skill as utm_source, three languages and no number", async () => {
  const html = renderReport(buildModel(await readingOf(page())));
  const at = html.indexOf('id="foot-gllmolfar"');
  assert.ok(at > 0);
  const a = html.slice(at, html.indexOf("</a>", at));
  assert.ok(a.includes('href="https://www.getlooploop.com/gllmolfar?utm_source=ai-search-audit&amp;utm_medium=skill-report&amp;utm_campaign=gllmolfar"'));
  assert.match(a, /<img class="gm-ico" src="data:image\/png;base64,iVBORw0KGgo[^"]+" alt="" width="16" height="16">/);
  for (const t of ["GLLmolfar", "crawl your whole site", "проскануйте весь сайт", "przeskanuj cały serwis"]) assert.ok(a.includes(t), t);
  assert.doesNotMatch(a.replace(/<img[^>]*>/, "").replace(/href="[^"]+"/, ""), /\d/, "no page count or price");
  assert.ok(html.includes('id="foot-linkedin"') && html.includes("the author"));
});
