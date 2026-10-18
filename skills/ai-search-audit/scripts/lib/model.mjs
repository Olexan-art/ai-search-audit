// One model of the audit, built once from the reading and its findings, and read by all three
// outputs (HTML, Markdown, JSON), so they can never disagree: the pin numbers, the tiles, the
// page map's zones and side strips, the checklist, the language grid, the bots, the waterfall.

import { auditFindings, textModules, SEVERITIES, SEVERITY_RANK } from "./checks.mjs";
import { headingKey } from "./facts.mjs";
import { AREAS, label, fmtEn, fmtPl, fmtUk, plForm, ukForm } from "./copy.mjs";
import { samePage } from "../vendor/vectorscope/technical.mjs";
import { pathOf as robotsPathOf } from "../vendor/vectorscope/robots.mjs";

/** How many findings the "Biggest problems" row shows. */
export const BIGGEST = 5;
/** A zone with less than this share of its text in a passage is drawn as unseen. */
export const UNSEEN_SHARE = 0.05;
/** Above this share a zone counts as read; between the two, the unseen part is drawn as a band. */
export const SEEN_SHARE = 0.9;

const uk = (n, a, b, c) => `${fmtUk(n)} ${ukForm(n, a, b, c)}`;
const pl = (n, a, b, c) => `${fmtPl(n)} ${plForm(n, a, b, c)}`;
const hasRow = (f, side, row) => f.strip && f.strip.side === side && f.strip.rows.includes(row);
const worst = (items) => items.reduce((w, f) => (SEVERITY_RANK[f.severity] > SEVERITY_RANK[w] ? f.severity : w), "low");

/** The cell state a set of findings gives: fail for medium and up, warn for low only, else pass. */
export const stateOf = (items) => (!items.length ? "pass" : items.some((f) => f.severity !== "low") ? "fail" : "warn");

function zoneSeen(reading) {
  const rows = reading.vs.losses?.sections?.rows || [];
  const zones = reading.facts.zones;
  const byKey = new Map();
  for (const z of zones) for (const h of z.headings) if (!byKey.has(headingKey(h))) byKey.set(headingKey(h), z.id);
  const acc = new Map();
  const add = (id, chars, inP) => {
    const a = acc.get(id) || { chars: 0, inPassages: 0 };
    a.chars += chars;
    a.inPassages += inP;
    acc.set(id, a);
  };
  const firstFlow = zones.find((z) => z.kind === "hero" || z.kind === "intro" || z.kind === "section");
  for (const row of rows) {
    if (row.inPassages === null || !row.chars) continue;
    if (row.kind === "h2") {
      const id = byKey.get(headingKey(row.heading));
      if (id !== undefined) add(id, row.chars, row.inPassages);
    } else if (row.kind === "before_first_h2" && firstFlow) add(firstFlow.id, row.chars, row.inPassages);
  }
  const out = new Map();
  for (const [id, a] of acc) out.set(id, a.chars ? a.inPassages / a.chars : null);
  return out;
}

function isHome(reading) {
  try {
    return new URL(reading.fetch.finalUrl).pathname === "/";
  } catch {
    return false;
  }
}

/** The checklist: 35 standard checks, each one a cell. `codes` are the findings that fail or warn it. */
function checklist(reading, findings) {
  const by = (codes) => findings.filter((f) => codes.includes(f.code));
  const hl = reading.facts.head.hreflang;
  const types = new Set(reading.facts.structured.jsonLd.flatMap((b) => b.types).concat(reading.facts.structured.microdata));
  const cells = [
    ["http_status", ["Status", "Статус", "Status"], ["HTTP status and redirects", "HTTP-статус і переадресації", "Status HTTP i przekierowania"], ["redirect_chain"], reading.fetch.saved ? "na" : null],
    ["https", ["HTTPS", "HTTPS", "HTTPS"], ["Served over HTTPS", "Віддається через HTTPS", "Serwowana przez HTTPS"], ["not_https"], null],
    ["robots_search_bots", ["Robots", "Robots", "Robots"], ["Googlebot and Bingbot may fetch the page", "Googlebot і Bingbot можуть завантажити сторінку", "Googlebot i Bingbot mogą pobrać stronę"], ["search_engine_blocked", "robots_unreachable"], reading.robots.status === "not_checked" ? "na" : null],
    ["noindex", ["noindex", "noindex", "noindex"], ["Not marked noindex", "Не позначено noindex", "Bez oznaczenia noindex"], ["noindex"], null],
    ["canonical", ["Canonical", "Canonical", "Canonical"], ["One absolute canonical to the page itself", "Один абсолютний canonical на саму сторінку", "Jeden bezwzględny canonical wskazujący na samą stronę"], ["canonical_missing", "canonical_relative", "canonical_other", "canonical_multiple"], null],
    ["in_sitemap", ["Sitemap", "Sitemap", "Sitemap"], ["Listed in the sitemap", "Є в sitemap", "Jest w sitemap"], ["sitemap_missing", "sitemap_not_listed", "robots_no_sitemap", "sitemap_lastmod_invalid"], !reading.sitemap || (reading.sitemap.found && reading.sitemap.listsPage === null) ? "na" : null],
    ["indexed", ["Index", "Індекс", "Indeks"], ["In Google's index", "В індексі Google", "W indeksie Google"], [], "na"],
    ["title_length", ["Title", "Title", "Title"], ["Title present, 10–60 characters", "Title є, 10–60 символів", "Title jest, 10–60 znaków"], ["title_missing", "title_too_long", "title_too_short"], null],
    ["title_unique", ["Title ×lang", "Title ×мови", "Title ×języki"], ["A different title per language version", "Різний title у кожній мовній версії", "Inny title w każdej wersji językowej"], ["title_duplicate_locales"], !hl.length ? "none" : !reading.alternates ? "na" : null],
    ["meta_description", ["Description", "Опис", "Opis"], ["Description present, 70–160 characters", "Опис є, 70–160 символів", "Opis jest, 70–160 znaków"], ["meta_description_missing", "meta_description_short", "meta_description_long"], null],
    ["social_preview", ["Preview", "Прев’ю", "Podgląd"], ["Open Graph and Twitter card tags", "Теги Open Graph і Twitter card", "Tagi Open Graph i Twitter card"], ["social_tags_missing", "og_image_broken"], null],
    ["h1", ["H1", "H1", "H1"], ["One h1", "Один h1", "Jeden h1"], ["h1_missing", "h1_multiple"], null],
    ["heading_order", ["Headings", "Заголовки", "Nagłówki"], ["No skipped heading levels", "Без пропущених рівнів заголовків", "Bez pominiętych poziomów nagłówków"], ["heading_order_skip"], null],
    ["image_alt", ["Alt", "Alt", "Alt"], ["Images carry alt", "Зображення мають alt", "Obrazy mają alt"], ["image_alt_missing", "image_link_alt_empty", "image_alt_repeated"], reading.facts.images.length ? null : "none"],
    ["html_lang", ["lang", "lang", "lang"], ["html lang declared", "html lang оголошено", "html lang zadeklarowany"], ["html_lang_missing", "html_lang_invalid"], null],
    ["url_readable", ["URL", "URL", "URL"], ["A readable URL", "Зручна адреса", "Czytelny adres URL"], ["url_unreadable"], null],
    ["internal_links", ["Links", "Посилання", "Linki"], ["Internal links present", "Є внутрішні посилання", "Są linki wewnętrzne"], ["internal_links_none"], null],
    ["link_text", ["Link text", "Текст посилань", "Tekst linków"], ["Links say where they lead, #links have a target, no nofollow inside the site", "Посилання кажуть, куди ведуть, # мають ціль, без nofollow усередині сайту", "Linki mówią, dokąd prowadzą, linki # mają cel, bez nofollow wewnątrz serwisu"], ["link_text_generic", "fragment_link_broken", "internal_nofollow"], reading.facts.links.length || (reading.facts.fragments || []).length ? null : "none"],
    ["broken_links", ["404", "404", "404"], ["Links answer without errors", "Посилання відповідають без помилок", "Linki odpowiadają bez błędów"], ["broken_links"], !reading.links ? "na" : reading.links.total === 0 ? "none" : null],
    ["viewport", ["Viewport", "Viewport", "Viewport"], ["A mobile viewport", "Мобільний viewport", "Mobilny viewport"], ["viewport_missing"], null],
    ["page_weight", ["Weight", "Вага", "Waga"], ["HTML size and scripts", "Розмір HTML і скрипти", "Rozmiar HTML i skrypty"], ["page_weight_heavy"], null],
    ["core_web_vitals", ["CWV", "CWV", "CWV"], ["Core Web Vitals from real users", "Core Web Vitals від реальних користувачів", "Core Web Vitals od prawdziwych użytkowników"], [], "na"],
    ["hreflang_pairs", ["hreflang", "hreflang", "hreflang"], ["hreflang versions link back", "Мовні версії hreflang посилаються взаємно", "Wersje hreflang linkują do siebie nawzajem"], ["hreflang_no_return", "hreflang_invalid_code", "hreflang_no_self", "hreflang_alternate_broken"], !hl.length ? "none" : !reading.alternates ? "na" : null],
    ["rich_faqpage", ["FAQ", "FAQ", "FAQ"], ["FAQPage markup", "Розмітка FAQPage", "Znaczniki FAQPage"], ["faq_schema_not_visible", "faq_rich_result_retired"], types.has("FAQPage") ? null : "none"],
    ["rich_breadcrumb", ["Breadcrumb", "Ланцюжок", "Okruszki"], ["BreadcrumbList markup", "Розмітка BreadcrumbList", "Znaczniki BreadcrumbList"], [], types.has("BreadcrumbList") ? null : "none"],
    ["images", ["Images", "Зображення", "Obrazy"], ["Image sizes, formats, lazy loading, srcset", "Розміри, формати, lazy і srcset зображень", "Rozmiary, formaty, lazy loading i srcset obrazów"], ["image_dimensions_missing", "image_lcp_lazy", "image_not_lazy", "image_legacy_format", "image_oversized", "image_no_srcset"], reading.facts.images.length ? null : "none"],
    ["snippet", ["Snippet", "Сніпет", "Snippet"], ["Eligible for a snippet (no nosnippet, max-snippet:0)", "Може мати сніпет (без nosnippet, max-snippet:0)", "Może mieć snippet (bez nosnippet, max-snippet:0)"], ["snippet_blocked"], null],
    ["favicon", ["Favicon", "Favicon", "Favicon"], ["A favicon that loads", "Favicon завантажується", "Favicon się wczytuje"], ["favicon_missing"], !reading.site ? "na" : null],
    ["site_name", ["Site name", "Назва сайту", "Nazwa serwisu"], ["WebSite name markup on the home page", "Назва сайту в розмітці WebSite на головній", "Nazwa serwisu w znacznikach WebSite na stronie głównej"], ["site_name_missing"], isHome(reading) ? null : "none"],
    ["mixed", ["Mixed", "Змішаний", "Mieszane"], ["No http:// resources on https", "Без ресурсів http:// на https", "Bez zasobów http:// na https"], ["mixed_content"], null],
    ["soft404", ["Soft 404", "Soft 404", "Soft 404"], ["A missing page answers 404", "Неіснуюча сторінка відповідає 404", "Nieistniejąca strona odpowiada 404"], ["soft_404"], !reading.site ? "na" : null],
    ["variants", ["Variants", "Варіанти", "Warianty"], ["http, www and slash variants end at the page", "Варіанти http, www і слеш ведуть на сторінку", "Warianty http, www i z ukośnikiem prowadzą do strony"], ["url_variants_inconsistent"], !reading.site ? "na" : null],
    ["hsts", ["HSTS", "HSTS", "HSTS"], ["Strict-Transport-Security header", "Заголовок Strict-Transport-Security", "Nagłówek Strict-Transport-Security"], ["hsts_missing"], reading.fetch.saved ? "na" : null],
    ["response", ["Headers", "Заголовки HTTP", "Nagłówki HTTP"], ["Compression, Cache-Control and security headers", "Стиснення, Cache-Control і заголовки безпеки", "Kompresja, Cache-Control i nagłówki bezpieczeństwa"], ["html_not_compressed", "html_no_cache_control", "security_headers_missing"], reading.fetch.saved ? "na" : null],
    ["trust", ["Trust", "Довіра", "Zaufanie"], ["Author, About, Contact, organisation, dates, privacy and terms", "Автор, «Про нас», контакти, організація, дати, конфіденційність і умови", "Autor, „O nas”, kontakt, organizacja, daty, prywatność i regulamin"], ["author_missing", "about_contact_missing", "organization_details_missing", "article_date_missing", "privacy_terms_missing", "date_mismatch"], null],
  ];
  return cells.map(([id, short, name, codes, fixed]) => {
    let items = by(codes);
    if (id === "rich_breadcrumb") items = findings.filter((f) => f.code === "schema_required_missing" && f.evidence.types.includes("BreadcrumbList"));
    const state = fixed && !items.length ? fixed : stateOf(items);
    return { id, short, name, state, codes: items.map((f) => f.code) };
  });
}

/** The language grid: this page and each alternate, by title, description, hreflang and html lang. */
function languageGrid(reading, findings, modules) {
  const hl = reading.facts.head.hreflang;
  if (!hl.length) return null;
  const f = (code) => findings.find((x) => x.code === code);
  const dupT = f("title_duplicate_locales");
  const dupD = f("description_duplicate_locales");
  const noReturn = f("hreflang_no_return");
  const broken = f("hreflang_alternate_broken");
  const noSelf = f("hreflang_no_self");
  const mismatch = f("hreflang_lang_mismatch");
  const inGroup = (fd, lang) => Boolean(fd && fd.evidence.groups.some((g) => g.includes(lang)));
  const page = reading.fetch.finalUrl;
  const canonical = reading.vs.technical?.canonical?.resolved;
  const self = hl.find((h) => h.href && (samePage(h.href, page) || (canonical && samePage(h.href, canonical))));
  const selfLang = self?.hreflang || reading.facts.head.lang || "—";
  const rows = [];
  const langOff = (lang, hreflang) => !lang || Boolean(mismatch && mismatch.evidence.items.some((s) => s.startsWith(`${hreflang}:`)));
  const locales = modules?.locales || null;
  const drift = f("locale_facts_differ");
  const factsCell = (hreflang) => {
    const c = locales?.compared.find((x) => x.hreflang === hreflang);
    if (!c || !c.aligned) return "na";
    return drift && drift.evidence.items.some((d) => d.hreflang === hreflang) ? "fail" : "pass";
  };
  const selfFacts = !locales || !locales.compared.some((c) => c.aligned) ? "na" : drift ? "fail" : "pass";
  rows.push({ hreflang: selfLang, self: true, cells: [inGroup(dupT, selfLang) ? "fail" : "pass", inGroup(dupD, selfLang) ? "warn" : "pass", noSelf ? "fail" : langOff(reading.facts.head.lang, selfLang) ? "warn" : "pass", selfFacts] });
  for (const a of reading.alternates?.results || []) {
    if (a.refused) {
      rows.push({ hreflang: a.hreflang, refused: true, cells: ["na", "na", "na", "na"] });
      continue;
    }
    if (!a.ok) {
      rows.push({ hreflang: a.hreflang, cells: ["na", "na", broken ? "fail" : "na", "na"] });
      continue;
    }
    const back = noReturn && noReturn.evidence.langs.includes(a.hreflang);
    const bad = broken && broken.evidence.langs.includes(a.hreflang);
    rows.push({ hreflang: a.hreflang, cells: [inGroup(dupT, a.hreflang) ? "fail" : "pass", inGroup(dupD, a.hreflang) ? "warn" : "pass", back || bad ? "fail" : langOff(a.lang, a.hreflang) ? "warn" : "pass", factsCell(a.hreflang)] });
  }
  return {
    rows,
    xDefault: hl.some((h) => h.hreflang.toLowerCase() === "x-default"),
    declared: hl.length,
    unread: reading.alternates ? reading.alternates.unchecked.length : null,
    cap: reading.alternates?.cap ?? null,
    measured: Boolean(reading.alternates),
  };
}

/** The <head> strip and the robots.txt · llms.txt strip: one row per thing, with its value. */
function strips(reading, findings) {
  const h = reading.facts.head;
  const st = reading.facts.structured;
  const titleDup = findings.find((f) => f.code === "title_duplicate_locales");
  const chars = (n) => [`${fmtEn(n)} characters`, uk(n, "символ", "символи", "символів"), pl(n, "znak", "znaki", "znaków")];
  const none = ["none", "немає", "brak"];
  let canonical = none;
  const c = reading.vs.technical?.canonical;
  if (c?.present) {
    let v = c.href;
    try {
      const u = new URL(c.resolved);
      v = c.self ? `${u.pathname}${u.search}` : c.resolved;
    } catch {}
    canonical = [c.count > 1 ? `×${c.count} · ${v}` : v, c.count > 1 ? `×${c.count} · ${v}` : v, c.count > 1 ? `×${c.count} · ${v}` : v];
  }
  const robotsMeta = h.robotsMeta.map((m) => m.content).join(" · ");
  const xr = reading.fetch.xRobotsTag ? ` · X-Robots-Tag: ${reading.fetch.xRobotsTag}` : "";
  const types = [...new Set(st.jsonLd.flatMap((b) => b.top || b.types))];
  const typesText = types.length ? (types.length > 2 ? `${types.slice(0, 2).join(", ")} +${types.length - 2}` : types.join(", ")) : st.microdata.length || st.rdfa.length ? `${[...st.microdata, ...st.rdfa].slice(0, 2).join(", ")}` : "";
  const socialHave = ["og:title", "og:description", "og:image"].filter((k) => h.og[k]).length + (h.twitter["twitter:card"] ? 1 : 0);
  const langs = h.hreflang.map((x) => x.hreflang);
  const head = [
    { id: "title", k: "title", v: !h.title ? none : titleDup ? [`same ×${titleDup.evidence.count} languages`, `однаковий ×${titleDup.evidence.count} мови`, `ten sam ×${titleDup.evidence.count} języki`] : chars(h.title.length) },
    { id: "description", k: "meta description", v: h.metaDescriptions[0] ? chars(h.metaDescriptions[0].length) : none },
    { id: "canonical", k: "canonical", v: canonical },
    { id: "robots", k: "meta robots", v: robotsMeta || xr ? [`${robotsMeta || "—"}${xr}`, `${robotsMeta || "—"}${xr}`, `${robotsMeta || "—"}${xr}`] : ["not set", "не задано", "nie ustawiono"] },
    { id: "hreflang", k: "hreflang", v: langs.length ? [langs.length > 5 ? `${langs.slice(0, 5).join(" · ")} +${langs.length - 5}` : langs.join(" · "), langs.length > 5 ? `${langs.slice(0, 5).join(" · ")} +${langs.length - 5}` : langs.join(" · "), langs.length > 5 ? `${langs.slice(0, 5).join(" · ")} +${langs.length - 5}` : langs.join(" · ")] : none },
    { id: "lang", k: "html lang", v: h.lang ? [h.lang, h.lang, h.lang] : none },
    { id: "jsonld", k: "JSON-LD", v: typesText ? [typesText, typesText, typesText] : st.jsonLd.length ? [`${st.jsonLd.length} blocks`, `${st.jsonLd.length} блоки`, pl(st.jsonLd.length, "blok", "bloki", "bloków")] : none },
    { id: "social", k: "Open Graph", v: [`${socialHave} of 4 tags`, `${socialHave} з 4 тегів`, `${socialHave} z 4 tagów`] },
    { id: "viewport", k: "viewport", v: h.viewport ? ["set", "задано", "ustawiono"] : none },
    { id: "scripts", k: "scripts", v: [`${h.scripts.total} · ${h.scripts.blocking} blocking`, `${h.scripts.total} · ${h.scripts.blocking} блокують`, `${h.scripts.total} · ${h.scripts.blocking} blokujących`] },
    { id: "favicon", k: "favicon", v: !reading.site ? (reading.facts.extras?.icons.length ? ["declared", "оголошено", "zadeklarowano"] : ["not measured", "не виміряно", "nie zmierzono"]) : reading.site.favicon.ok ? ["loads", "завантажується", "wczytuje się"] : reading.site.favicon.reason === "data_uri" ? ["data: URI", "data: URI", "data: URI"] : Array(3).fill(`HTTP ${reading.site.favicon.status ?? "—"}`) },
  ];
  const r = reading.robots;
  const bots = r.bots || [];
  const groupVal = (kinds) => {
    if (r.status === "not_checked") return ["not measured", "не виміряно", "nie zmierzono"];
    if (r.status === "unreachable") return ["no answer", "немає відповіді", "brak odpowiedzi"];
    const b = bots.filter((x) => kinds.includes(x.kind) && !x.allowed);
    return b.length ? [`${b.length} blocked`, `${b.length} заборонено`, `zablokowane: ${b.length}`] : ["allowed", "дозволено", "dozwolone"];
  };
  const sm = reading.sitemap;
  const ll = reading.llms;
  const site = reading.site;
  const robots = [
    { id: "search", k: "Google · Bing", v: groupVal(["index"]) },
    { id: "ai_search", k: ["AI search bots", "ШІ-пошуковики", "Boty wyszukiwania AI"], v: groupVal(["search", "user"]) },
    { id: "ai_training", k: ["AI training bots", "Боти навчання ШІ", "Boty trenujące AI"], v: groupVal(["training"]) },
    { id: "sitemap", k: "sitemap.xml", v: !sm ? ["not measured", "не виміряно", "nie zmierzono"] : !sm.found ? ["not found", "не знайдено", "nie znaleziono"] : sm.listsPage === true ? ["lists the page", "сторінка є", "strona jest"] : sm.listsPage === false ? ["page not listed", "сторінки немає", "strony brak"] : ["not measured", "не виміряно", "nie zmierzono"] },
    { id: "llms", k: "llms.txt", v: !ll ? ["not measured", "не виміряно", "nie zmierzono"] : ll.present ? [`present · ${ll.links} links`, `є · ${uk(ll.links, "посилання", "посилання", "посилань")}`, `jest · ${pl(ll.links, "link", "linki", "linków")}`] : none },
    { id: "markdown", k: ["Markdown copy", "Markdown-копія", "Kopia Markdown"], v: !site ? ["not measured", "не виміряно", "nie zmierzono"] : site.markdown.ok ? [site.markdown.declared ? "declared · loads" : ".md · loads", site.markdown.declared ? "оголошено · є" : ".md · є", site.markdown.declared ? "zadeklarowano · wczytuje się" : ".md · wczytuje się"] : site.markdown.declared ? [`declared · HTTP ${site.markdown.status ?? "—"}`, `оголошено · HTTP ${site.markdown.status ?? "—"}`, `zadeklarowano · HTTP ${site.markdown.status ?? "—"}`] : none },
    { id: "ai_catalog", k: "ai-catalog.json", v: !site ? ["not measured", "не виміряно", "nie zmierzono"] : !site.aiCatalog?.present ? none : site.aiCatalog.valid ? ["present · JSON", "є · JSON", "jest · JSON"] : ["present · not JSON", "є · не JSON", "jest · nie JSON"] },
  ];
  const attach = (side, rows) => rows.map((row) => ({ ...row, pins: findings.filter((f) => hasRow(f, side, row.id)) }));
  return { head: attach("head", head), robots: attach("robots", robots) };
}

/**
 * Build the model. `reading` must be ok. `extra` holds the validated judgement files (questions,
 * brand, reviews) and the user's keyword; each is optional, and a missing one is reported.
 */
export function buildModel(reading, extra = {}) {
  const modules = textModules(reading, extra);
  const findings = auditFindings(reading, { ...extra, modules }).map((f) => ({ ...f, label: label(f) }));
  const zones = reading.facts.zones;
  const seen = zoneSeen(reading);
  const jsZones = (reading.render?.jsZones || []).map((z, i) => ({ ...z, id: `js${i}`, kind: "js" }));
  // Order of zones as drawn: the plain zones, with each JS-only zone after the one it follows.
  const drawn = [];
  for (const z of zones) {
    drawn.push({ ...z, seen: seen.has(z.id) ? seen.get(z.id) : null });
    for (const j of jsZones.filter((x) => x.after === z.id)) drawn.push(j);
  }
  const position = new Map(drawn.map((z, i) => [z.id, i]));
  const { head, robots } = strips(reading, findings);
  const rowPos = (f) => {
    if (f.zones.length) return Math.min(...f.zones.map((z) => position.get(z) ?? 999));
    if (f.strip) {
      const rows = f.strip.side === "head" ? head : robots;
      const i = rows.findIndex((r) => f.strip.rows.includes(r.id));
      return (f.strip.side === "head" ? 1000 : 2000) + Math.max(0, i);
    }
    return 9999;
  };
  // Pins: the biggest problems keep 1–5; the rest follow by severity, then top to bottom.
  const bigs = findings.slice(0, BIGGEST);
  const rest = findings.slice(BIGGEST).sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || rowPos(a) - rowPos(b));
  [...bigs, ...rest].forEach((f, i) => {
    f.pin = i + 1;
    f.big = i < BIGGEST;
    f.mapped = f.zones.length > 0 || Boolean(f.strip);
  });
  const ordered = [...bigs, ...rest];
  for (const z of drawn) z.pins = ordered.filter((f) => f.zones.includes(z.id));
  const tiles = AREAS.map((a) => {
    const items = findings.filter((f) => f.area === a.id);
    let state = items.some((f) => f.severity === "blocking") ? "block" : items.some((f) => f.severity === "high" || f.severity === "medium") ? "prob" : "ok";
    if (a.id === "lang" && !reading.facts.head.hreflang.length && !items.length) state = "na";
    if (a.id === "brand" && !extra.brand && !extra.reviews && !items.length) state = "na";
    return { id: a.id, q: a.q, state, count: items.length, minorOnly: items.length > 0 && state === "ok", worst: items.length ? worst(items) : null };
  });
  const counts = Object.fromEntries(SEVERITIES.map((s) => [s, findings.filter((f) => f.severity === s).length]));
  const w = reading.vs.losses?.waterfall || null;
  return {
    reading,
    findings: ordered,
    bigs,
    tiles,
    counts,
    zones: drawn,
    head,
    robots,
    mappedCount: ordered.filter((f) => f.mapped).length,
    unmappedCount: ordered.filter((f) => !f.mapped).length,
    checklist: checklist(reading, findings),
    languages: languageGrid(reading, findings, modules),
    bots: reading.robots.bots || [],
    robotsPath: robotsPathOf(reading.fetch.finalUrl),
    waterfall: w,
    passages: { used: reading.vs.passages.length, cap: reading.vs.page.chunkCap },
    caps: caps(reading, modules, extra),
    modules,
    extra,
    judgement: judgementSummary(extra),
    keyword: modules.keyword.keyword ? { keyword: modules.keyword.keyword, source: modules.keyword.source } : null,
  };
}

/** Who judged: the agent and model each judgement file names, and one line for the honesty note. */
function judgementSummary(extra) {
  const files = { questions: extra.questions?.judgement || null, brand: extra.brand?.judgement || null, reviews: extra.reviews?.judgement || null };
  const models = [...new Set(Object.values(files).filter(Boolean).map((j) => j.model).filter(Boolean))];
  const agents = [...new Set(Object.values(files).filter(Boolean).map((j) => j.agent).filter(Boolean))];
  return { files, model: models.length ? models.join(", ") : null, agent: agents.length ? agents.join(", ") : null, any: Object.values(files).some(Boolean) };
}

/** Every list the reading did not finish, and every module that did not run, so nothing reads as complete when it is not. */
function caps(r, modules = null, extra = {}) {
  const out = [];
  const p = modules?.patterns;
  if (p && !p.analysed) out.push({ id: "patterns", t: [`Writing patterns not analysed (${p.reason}): lexicons exist for English, Ukrainian and Spanish`, `Шаблони письма не аналізовано (${p.reason}): словники є для англійської, української й іспанської`, `Schematy pisania nie zostały przeanalizowane (${p.reason}): słowniki istnieją dla angielskiego, ukraińskiego i hiszpańskiego`] });
  if (p?.analysed && p.score?.band === "insufficient_text") out.push({ id: "patterns_short", t: [`Writing patterns: ${p.wordCount} words, under the 60 the density needs; no score`, `Шаблони письма: ${p.wordCount} слів, менше за 60, потрібних для щільності; без оцінки`, `Schematy pisania: ${pl(p.wordCount, "słowo", "słowa", "słów")}, mniej niż 60 potrzebnych do gęstości; bez wyniku`] });
  if (modules?.keyword?.skipped) out.push({ id: "keyword", t: ["Keyword not checked: no --keyword and no h1 to read one from", "Ключову фразу не перевірено: немає --keyword і немає h1", "Nie sprawdzono frazy kluczowej: brak --keyword i brak h1, z którego można ją odczytać"] });
  if (modules?.keyword && !modules.keyword.skipped && !modules.keyword.promiseChecked) out.push({ id: "promise", t: ["The promise-without-a-figure rule reads English only", "Правило «обіцянка без числа» читає лише англійську", "Reguła „obietnica bez liczby” czyta tylko tekst angielski"] });
  const unaligned = (modules?.locales?.compared || []).filter((c) => !c.aligned && c.reason !== "no_sections");
  if (unaligned.length) out.push({ id: "locales", n: unaligned.length, t: [`Facts not compared for ${unaligned.map((c) => `${c.hreflang} (${c.sections[1]} sections vs ${c.sections[0]})`).join(", ")}: the sections do not line up`, `Факти не порівняно для ${unaligned.map((c) => `${c.hreflang} (${c.sections[1]} розділів проти ${c.sections[0]})`).join(", ")}: розділи не збігаються`, `Nie porównano faktów dla ${unaligned.map((c) => `${c.hreflang} (${c.sections[1]} sekcji wobec ${c.sections[0]})`).join(", ")}: sekcje do siebie nie pasują`] });
  for (const [k, name] of [["questions", "questions.json"], ["brand", "brand.json"], ["reviews", "reviews.json"]]) if (!extra[k]) out.push({ id: `no_${k}`, t: [`${name} not given: that judgement was not made`, `${name} не надано: цього судження не зроблено`, `Nie podano ${name}: tej oceny nie wykonano`] });
  if (r.links?.unchecked) out.push({ id: "links", n: r.links.unchecked, cap: r.links.cap, t: [`${r.links.unchecked} links not checked (cap ${r.links.cap})`, `${uk(r.links.unchecked, "посилання", "посилання", "посилань")} не перевірено (ліміт ${r.links.cap})`, `Nie sprawdzono: ${pl(r.links.unchecked, "link", "linki", "linków")} (limit ${r.links.cap})`] });
  const unverified = (r.links?.results || []).filter((x) => x.verdict === "unverified").length;
  if (unverified) out.push({ id: "links_unverified", n: unverified, t: [`${unverified} links did not answer or refused the check`, `${uk(unverified, "посилання не відповіло", "посилання не відповіли", "посилань не відповіли")} або відмовили в перевірці`, `Bez odpowiedzi lub z odmową sprawdzenia: ${pl(unverified, "link", "linki", "linków")}`] });
  if (r.alternates?.unchecked.length) out.push({ id: "alternates", n: r.alternates.unchecked.length, cap: r.alternates.cap, t: [`${r.alternates.unchecked.length} language versions not read (cap ${r.alternates.cap})`, `${uk(r.alternates.unchecked.length, "мовну версію", "мовні версії", "мовних версій")} не прочитано (ліміт ${r.alternates.cap})`, `Nie przeczytano: ${pl(r.alternates.unchecked.length, "wersja językowa", "wersje językowe", "wersji językowych")} (limit ${r.alternates.cap})`] });
  if (r.sitemap?.children.unread && r.sitemap.listsPage !== true) out.push({ id: "sitemap", n: r.sitemap.children.unread, cap: r.sitemap.children.cap, t: [`${r.sitemap.children.unread} child sitemaps not read (cap ${r.sitemap.children.cap})`, `${uk(r.sitemap.children.unread, "дочірній sitemap", "дочірні sitemap", "дочірніх sitemap")} не прочитано (ліміт ${r.sitemap.children.cap})`, `Nie przeczytano: ${pl(r.sitemap.children.unread, "podrzędna sitemap", "podrzędne sitemapy", "podrzędnych sitemap")} (limit ${r.sitemap.children.cap})`] });
  if (r.images?.unchecked) out.push({ id: "images", n: r.images.unchecked, cap: r.images.cap, t: [`${r.images.unchecked} images not sized (cap ${r.images.cap})`, `${uk(r.images.unchecked, "зображення", "зображення", "зображень")} без перевірки розміру (ліміт ${r.images.cap})`, `${pl(r.images.unchecked, "obraz", "obrazy", "obrazów")} bez sprawdzenia rozmiaru (limit ${r.images.cap})`] });
  if (r.shell?.detected) {
    if (r.render?.ok) out.push({ id: "render_auto", t: [`An app shell: rendered in ${r.render.browser} on its own; ${r.render.jsZones.length} sections only with JavaScript`, `Оболонка застосунку: відрендерено в ${r.render.browser} автоматично; ${r.render.jsZones.length} розділів лише з JavaScript`, `Powłoka aplikacji: wyrenderowano automatycznie w ${r.render.browser}; sekcje tylko z JavaScriptem: ${r.render.jsZones.length}`] });
    else if (r.render) out.push({ id: "render_none", t: [`An app shell, and no render: ${r.render.reason === "no_browser" ? "no Chrome or Chromium found (set CHROME_PATH)" : r.render.reason}; the JavaScript-only text is not measured`, `Оболонка застосунку без рендеру: ${r.render.reason === "no_browser" ? "не знайдено Chrome чи Chromium (задайте CHROME_PATH)" : r.render.reason}; текст лише з JavaScript не виміряно`, `Powłoka aplikacji bez renderowania: ${r.render.reason === "no_browser" ? "nie znaleziono Chrome ani Chromium (ustaw CHROME_PATH)" : r.render.reason}; tekstu dostępnego tylko z JavaScriptem nie zmierzono`] });
    else out.push({ id: "render_none", t: ["An app shell in a saved page: not rendered", "Оболонка застосунку в збереженій сторінці: не відрендерено", "Powłoka aplikacji w zapisanej stronie: nie wyrenderowano"] });
  }
  const merged = r.facts.zones.find((z) => z.kind === "more");
  if (merged) out.push({ id: "zones", n: merged.merged, t: [`${merged.merged} sections drawn as one zone on the map`, `${uk(merged.merged, "розділ", "розділи", "розділів")} на мапі показано однією зоною`, `${pl(merged.merged, "sekcja pokazana", "sekcje pokazane", "sekcji pokazanych")} na mapie jako jedna strefa`] });
  if (r.fetch.saved) out.push({ id: "saved", t: ["A saved page: robots.txt, sitemap, llms.txt, language versions and links not measured", "Збережена сторінка: robots.txt, sitemap, llms.txt, мовні версії й посилання не виміряно", "Zapisana strona: nie zmierzono robots.txt, sitemap, llms.txt, wersji językowych ani linków"] });
  return out;
}
