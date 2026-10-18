// The report's own words, in English (the default), Ukrainian and Polish. Codes travel on the wire; the
// sentence is chosen here. Lite shows short labels only: no descriptions, no "what the rule
// says", no fix directions. Every entry is [en, uk, pl]; a label is a function of the evidence.
// Page content (headings, titles) is never translated.

import { plForm, ukForm } from "../vendor/vectorscope/i18n.mjs";

export { plForm, ukForm };

export const fmtEn = (n) => Number(n ?? 0).toLocaleString("en-US");
export const fmtUk = (n) => Number(n ?? 0).toLocaleString("en-US").replace(/,/g, " ");
/** Polish groups thousands as Ukrainian does. */
export const fmtPl = (n) => fmtUk(n);
const en = (n, one, many) => `${fmtEn(n)} ${n === 1 ? one : many}`;
const uk = (n, one, few, many) => `${fmtUk(n)} ${ukForm(n, one, few, many)}`;
const pl = (n, one, few, many) => `${fmtPl(n)} ${plForm(n, one, few, many)}`;
const kb = (bytes) => Math.round(bytes / 1024);
const dec = (n, sep) => String(Number(n ?? 0)).replace(".", sep);
const clipQ = (t, n) => {
  const x = String(t ?? "").replace(/\s+/g, " ").trim();
  return x.length > n ? `${x.slice(0, n - 1)}…` : x;
};
const q = (t, n = 38) => `“${clipQ(t, n)}”`;
/** The same quote with Polish marks. */
const qPl = (t, n = 38) => `„${clipQ(t, n)}”`;
const list = (xs, n = 2) => (xs.length > n ? `${xs.slice(0, n).join(", ")} +${xs.length - n}` : xs.join(", "));

/** Short labels, three to six words, for the map, the chips and the Markdown. */
export const LABELS = {
  robots_unreachable: () => ["robots.txt does not answer", "robots.txt не відповідає", "robots.txt nie odpowiada"],
  search_engine_blocked: (e) => [`${list(e.bots)} blocked`, `${list(e.bots)} заблоковано`, `Zablokowano: ${list(e.bots)}`],
  ai_search_blocked: (e) => (e.bots.length === 1 ? [`${e.bots[0]} blocked`, `${e.bots[0]} заблоковано`, `Zablokowano: ${e.bots[0]}`] : [`${e.bots.length} AI search bots blocked`, `${uk(e.bots.length, "ШІ-бот пошуку", "ШІ-боти пошуку", "ШІ-ботів пошуку")} заблоковано`, `Zablokowano ${pl(e.bots.length, "bota wyszukiwania AI", "boty wyszukiwania AI", "botów wyszukiwania AI")}`]),
  ai_training_blocked: (e) => (e.bots.length <= 2 ? [`${e.bots.join(", ")} blocked`, `${e.bots.join(", ")} заблоковано`, `Zablokowano: ${e.bots.join(", ")}`] : [`${e.bots.length} training bots blocked`, `${uk(e.bots.length, "бот навчання", "боти навчання", "ботів навчання")} заблоковано`, `Zablokowano ${pl(e.bots.length, "bota do trenowania AI", "boty do trenowania AI", "botów do trenowania AI")}`]),
  noindex: () => ["The page says noindex", "Сторінка каже noindex", "Strona ma ustawione noindex"],
  llms_txt_missing: () => ["No llms.txt", "Немає llms.txt", "Brak llms.txt"],
  not_https: () => ["No HTTPS", "Без HTTPS", "Brak HTTPS"],
  redirect_chain: (e) => [`${e.hops} redirects in a row`, `${uk(e.hops, "переадресація", "переадресації", "переадресацій")} поспіль`, `${pl(e.hops, "przekierowanie", "przekierowania", "przekierowań")} z rzędu`],
  sitemap_missing: () => ["No sitemap found", "Sitemap не знайдено", "Nie znaleziono sitemap"],
  sitemap_not_listed: () => ["Not in the sitemap", "Немає в sitemap", "Brak w sitemap"],
  title_missing: () => ["No title", "Немає title", "Brak title"],
  title_too_long: (e) => [`Title too long · ${e.length}`, `Title задовгий · ${e.length}`, `Title za długi · ${e.length}`],
  title_too_short: (e) => [`Title too short · ${e.length}`, `Title закороткий · ${e.length}`, `Title za krótki · ${e.length}`],
  meta_description_missing: () => ["No description", "Немає опису", "Brak opisu"],
  meta_description_short: (e) => [`Description too short · ${e.length}`, `Опис закороткий · ${e.length}`, `Opis za krótki · ${e.length}`],
  meta_description_long: (e) => [`Description too long · ${e.length}`, `Опис задовгий · ${e.length}`, `Opis za długi · ${e.length}`],
  h1_missing: () => ["No h1", "Немає h1", "Brak h1"],
  h1_multiple: (e) => [`${e.count} h1 headings`, uk(e.count, "заголовок h1", "заголовки h1", "заголовків h1"), pl(e.count, "nagłówek h1", "nagłówki h1", "nagłówków h1")],
  heading_order_skip: () => ["Heading levels skipped", "Пропущено рівні заголовків", "Pominięte poziomy nagłówków"],
  canonical_missing: () => ["No canonical", "Немає canonical", "Brak canonical"],
  canonical_relative: () => ["Canonical is relative", "Canonical відносний", "Canonical jest względny"],
  canonical_other: () => ["Canonical points elsewhere", "Canonical веде деінде", "Canonical wskazuje gdzie indziej"],
  canonical_multiple: () => ["Several canonicals", "Кілька canonical", "Kilka canonical"],
  internal_links_none: () => ["No internal links", "Немає внутрішніх посилань", "Brak linków wewnętrznych"],
  broken_links: (e) => (e.count === 1 ? ["A link leads to an error", "Посилання веде на помилку", "Link prowadzi do błędu"] : [`${e.count} broken links`, uk(e.count, "неробоче посилання", "неробочі посилання", "неробочих посилань"), pl(e.count, "niedziałający link", "niedziałające linki", "niedziałających linków")]),
  image_alt_missing: (e) => [en(e.count, "image without alt", "images without alt"), `${uk(e.count, "зображення", "зображення", "зображень")} без alt`, `${pl(e.count, "obraz", "obrazy", "obrazów")} bez alt`],
  viewport_missing: () => ["No viewport meta", "Немає meta viewport", "Brak meta viewport"],
  html_lang_missing: () => ["No html lang", "Немає html lang", "Brak html lang"],
  social_tags_missing: () => ["Preview tags missing", "Бракує тегів прев’ю", "Brak tagów podglądu"],
  page_weight_heavy: (e) => [`${fmtEn(kb(e.htmlBytes))} KB, ${en(e.scripts, "script", "scripts")}`, `${fmtUk(kb(e.htmlBytes))} КБ, ${uk(e.scripts, "скрипт", "скрипти", "скриптів")}`, `${fmtPl(kb(e.htmlBytes))} KB, ${pl(e.scripts, "skrypt", "skrypty", "skryptów")}`],
  url_unreadable: () => ["Hard-to-read URL", "Незручна адреса", "Nieczytelny adres URL"],
  jsonld_invalid: () => ["JSON-LD does not parse", "JSON-LD не розбирається", "Błąd parsowania JSON-LD"],
  structured_data_none: () => ["No structured data", "Немає структурованих даних", "Brak danych strukturalnych"],
  schema_required_missing: () => ["Required schema fields missing", "Бракує обов’язкових полів схеми", "Brak wymaganych pól schematu"],
  schema_recommended_missing: () => ["Recommended schema fields missing", "Бракує рекомендованих полів схеми", "Brak zalecanych pól schematu"],
  faq_rich_result_retired: () => ["FAQ rich result retired", "Розширеного FAQ більше немає", "Wynik rozszerzony FAQ wycofany"],
  faq_schema_not_visible: (e) => [`FAQ markup ≠ visible text · ${e.notVisible}`, `Розмітка FAQ ≠ видимий текст · ${e.notVisible}`, `Znaczniki FAQ ≠ widoczny tekst · ${e.notVisible}`],
  lost_faq_questions: () => ["FAQ answers lost their questions", "Відповіді FAQ без запитань", "Odpowiedzi FAQ bez pytań"],
  mid_sentence_start: (e) => {
    const n = e.count ?? e.samples?.length ?? 1;
    return n === 1
      ? ["A passage starts mid-sentence", "Уривок із середини речення", "Fragment zaczyna się w środku zdania"]
      : [`${n} passages start mid-sentence`, `${uk(n, "уривок", "уривки", "уривків")} із середини речення`, `${pl(n, "fragment zaczyna", "fragmenty zaczynają", "fragmentów zaczyna")} się w środku zdania`];
  },
  truncated_teaser: (e) => [en(e.count, "cut-off teaser", "cut-off teasers"), uk(e.count, "обрізаний анонс", "обрізані анонси", "обрізаних анонсів"), pl(e.count, "ucięta zajawka", "ucięte zajawki", "uciętych zajawek")],
  repeated_claim: () => ["The same claim, again and again", "Те саме твердження знову й знову", "To samo twierdzenie w kółko"],
  cap_overflow: (e) => [`${fmtEn(e.charsPastCap)} characters past the cap`, `${uk(e.charsPastCap, "символ", "символи", "символів")} за лімітом`, `${pl(e.charsPastCap, "znak", "znaki", "znaków")} poza limitem`],
  js_dependent: (e) => [`${fmtEn(e.withJs - e.withoutJs)} words need JavaScript`, `${uk(e.withJs - e.withoutJs, "слово", "слова", "слів")} лише з JavaScript`, `${pl(e.withJs - e.withoutJs, "słowo", "słowa", "słów")} tylko z JavaScriptem`],
  hero_lede_dropped: () => ["Opening paragraph unseen", "Вступ не видно", "Akapit otwierający niewidoczny"],
  hidden_headings: (e) => [`${en(e.count, "heading", "headings")} in hidden panels`, `${uk(e.count, "заголовок", "заголовки", "заголовків")} у прихованих панелях`, `${pl(e.count, "nagłówek", "nagłówki", "nagłówków")} w ukrytych panelach`],
  ssr_placeholder_text: () => ["Loading text read as content", "Напис завантаження як зміст", "Napis ładowania odczytany jako treść"],
  h1_glued_words: () => ["Heading words glued", "Слова заголовка злиплися", "Sklejone słowa nagłówka"],
  nav_in_content: () => ["Menu lines inside the text", "Рядки меню всередині тексту", "Wiersze menu wewnątrz tekstu"],
  dominant_heading: (e) => [`One section holds ${Math.round((e.share || 0) * 100)}%`, `Один розділ тримає ${Math.round((e.share || 0) * 100)}%`, `Jedna sekcja zawiera ${Math.round((e.share || 0) * 100)}%`],
  thin_section: (e) => {
    const n = e.count ?? 1;
    return [en(n, "very short section", "very short sections"), uk(n, "надто короткий розділ", "надто короткі розділи", "надто коротких розділів"), pl(n, "bardzo krótka sekcja", "bardzo krótkie sekcje", "bardzo krótkich sekcji")];
  },
  hreflang_no_return: (e) => [`${list(e.langs)}: no link back`, `${list(e.langs)}: немає зворотного посилання`, `${list(e.langs)}: brak linku zwrotnego`],
  hreflang_invalid_code: (e) => [`Invalid hreflang · ${list(e.codes)}`, `Хибний hreflang · ${list(e.codes)}`, `Błędny hreflang · ${list(e.codes)}`],
  hreflang_no_self: () => ["hreflang leaves this page out", "hreflang без цієї сторінки", "hreflang pomija tę stronę"],
  hreflang_alternate_broken: (e) => [`${list(e.langs)}: version answers wrong`, `${list(e.langs)}: версія відповідає з помилкою`, `${list(e.langs)}: wersja odpowiada błędem`],
  title_duplicate_locales: (e) => [`Same title in ${e.count} languages`, `Однаковий title у ${e.count} мовах`, `Ten sam title w ${e.count} językach`],
  description_duplicate_locales: (e) => [`Same description in ${e.count} languages`, `Однаковий опис у ${e.count} мовах`, `Ten sam opis w ${e.count} językach`],
  hreflang_lang_mismatch: () => ["html lang ≠ hreflang", "html lang ≠ hreflang", "html lang ≠ hreflang"],
  hreflang_no_x_default: () => ["No x-default", "Немає x-default", "Brak x-default"],
  llms_txt_one_language: () => ["llms.txt: one language only", "llms.txt: лише одна мова", "llms.txt: tylko jeden język"],
  locale_facts_differ: (e) => {
    const d = e.items[0];
    const more = e.count > 1 ? ` +${e.count - 1}` : "";
    return [`${d.values[0]} or ${d.values[1]}? · ${d.hreflang}${more}`, `${d.values[0]} чи ${d.values[1]}? · ${d.hreflang}${more}`, `${d.values[0]} czy ${d.values[1]}? · ${d.hreflang}${more}`];
  },
  question_missing: (e) => [`No answer: ${q(e.question)}`, `Без відповіді: ${q(e.question)}`, `Bez odpowiedzi: ${qPl(e.question)}`],
  question_partial: (e) => [`Answered in part: ${q(e.question)}`, `Частково: ${q(e.question)}`, `Odpowiedź częściowa: ${qPl(e.question)}`],
  stock_phrases: (e) => [`Stock phrases · ${dec(e.per1k, ".")} per 1,000 words`, `Шаблонні фрази · ${dec(e.per1k, ",")} на 1 000 слів`, `Utarte frazy · ${dec(e.per1k, ",")} na 1000 słów`],
  repeated_sentence_shape: (e) => [en(e.count, "sentence of one shape", "sentences of one shape"), `${uk(e.count, "речення", "речення", "речень")} однієї форми`, `${pl(e.count, "zdanie", "zdania", "zdań")} o tej samej budowie`],
  uniform_openings: (e) => [e.count === 1 ? "A run of sentences opens alike" : `${e.count} runs of sentences open alike`, e.count === 1 ? "Речення поспіль починаються однаково" : `${uk(e.count, "низка речень", "низки речень", "низок речень")} з однаковим початком`, e.count === 1 ? "Kolejne zdania zaczynają się tak samo" : `${pl(e.count, "ciąg zdań", "ciągi zdań", "ciągów zdań")} z takim samym początkiem`],
  unchecked_claims: (e) => [en(e.count, "claim with nothing to check", "claims with nothing to check"), `${uk(e.count, "твердження", "твердження", "тверджень")} без фактів для перевірки`, `${pl(e.count, "twierdzenie", "twierdzenia", "twierdzeń")} bez faktów do sprawdzenia`],
  keyword_not_in_title: () => ["Main phrase not in title or h1", "Головної фрази немає в title чи h1", "Głównej frazy nie ma w title ani h1"],
  keyword_variant_split: () => ["Main phrase written two ways", "Головну фразу написано двома способами", "Główna fraza zapisana na dwa sposoby"],
  keyword_one_section: (e) => [`Main phrase in ${e.sectionsReached} of ${e.sections} sections`, `Головна фраза в ${e.sectionsReached} із ${e.sections} розділів`, `Główna fraza w ${e.sectionsReached} z ${e.sections} sekcji`],
  off_keyword_share: (e) => [`${Math.round(e.offShare * 100)}% of the text off the phrase`, `${Math.round(e.offShare * 100)}% тексту без головної фрази`, `${Math.round(e.offShare * 100)}% tekstu bez głównej frazy`],
  promise_without_number: () => ["A promise with no figure", "Обіцянка без числа", "Obietnica bez liczby"],
  brand_contradiction: (e) => (e.count === 1 ? ["AI contradicts the page", "ШІ суперечить сторінці", "AI przeczy stronie"] : [`AI contradicts the page · ${e.count}`, `ШІ суперечить сторінці · ${e.count}`, `AI przeczy stronie · ${e.count}`]),
  brand_fact_absent: (e) => [`AI knows, the page lacks · ${e.count}`, `ШІ знає, на сторінці немає · ${e.count}`, `AI wie, na stronie brak · ${e.count}`],
  brand_unknown: () => ["AI doesn't know the brand", "ШІ не знає бренду", "AI nie zna marki"],
  review_rating_unbacked: (e) => (e.count === 1 ? [`${e.items[0].platform} rating, no source`, `Рейтинг ${e.items[0].platform} без джерела`, `Ocena ${e.items[0].platform} bez źródła`] : [`${e.count} ratings with no source`, `${uk(e.count, "рейтинг", "рейтинги", "рейтингів")} без джерела`, `${pl(e.count, "ocena", "oceny", "ocen")} bez źródła`]),
  review_control_hallucination: () => ["AI rated a platform that doesn't exist", "ШІ оцінив платформу, якої немає", "AI oceniło nieistniejącą platformę"],
  reviews_without_markup: () => ["Ratings shown without markup", "Оцінки без розмітки", "Oceny bez znaczników"],
  rich_result_retired: (e) => (e.items.length === 1 ? [`${e.items[0].feature}: no rich result any more`, `${e.items[0].feature}: розширеного результату більше немає`, `${e.items[0].feature}: wyniku rozszerzonego już nie ma`] : [`${e.items.length} retired rich results`, `${uk(e.items.length, "розширений результат", "розширені результати", "розширених результатів")} більше немає`, `${pl(e.items.length, "wycofany wynik rozszerzony", "wycofane wyniki rozszerzone", "wycofanych wyników rozszerzonych")}`]),
  image_dimensions_missing: (e) => [en(e.count, "image without width and height", "images without width and height"), `${uk(e.count, "зображення", "зображення", "зображень")} без width і height`, `${pl(e.count, "obraz", "obrazy", "obrazów")} bez width i height`],
  image_lcp_lazy: () => ["First image lazy-loaded", "Перше зображення з lazy", "Pierwszy obraz z lazy"],
  image_not_lazy: (e) => [en(e.count, "image below the fold loads eagerly", "images below the fold load eagerly"), `${uk(e.count, "зображення", "зображення", "зображень")} нижче екрана без lazy`, `${pl(e.count, "obraz", "obrazy", "obrazów")} poniżej pierwszego ekranu bez lazy`],
  image_legacy_format: (e) => [en(e.count, "image in JPEG or PNG only", "images in JPEG or PNG only"), `${uk(e.count, "зображення", "зображення", "зображень")} лише в JPEG чи PNG`, `${pl(e.count, "obraz", "obrazy", "obrazów")} tylko w JPEG lub PNG`],
  image_oversized: (e) => [en(e.count, "image over 200 KB", "images over 200 KB"), `${uk(e.count, "зображення", "зображення", "зображень")} понад 200 КБ`, `${pl(e.count, "obraz", "obrazy", "obrazów")} powyżej 200 KB`],
  image_no_srcset: (e) => [en(e.count, "large image without srcset", "large images without srcset"), `${uk(e.count, "велике зображення", "великі зображення", "великих зображень")} без srcset`, `${pl(e.count, "duży obraz", "duże obrazy", "dużych obrazów")} bez srcset`],
  favicon_missing: () => ["Favicon does not load", "Favicon не завантажується", "Favicon się nie wczytuje"],
  site_name_missing: () => ["No WebSite name markup", "Немає назви сайту в розмітці", "Brak nazwy serwisu w znacznikach WebSite"],
  mixed_content: (e) => [en(e.count, "http:// resource on an https page", "http:// resources on an https page"), `${uk(e.count, "ресурс", "ресурси", "ресурсів")} http:// на https-сторінці`, `${pl(e.count, "zasób", "zasoby", "zasobów")} http:// na stronie https`],
  soft_404: () => ["A missing page answers 200", "Неіснуюча сторінка відповідає 200", "Nieistniejąca strona odpowiada 200"],
  url_variants_inconsistent: (e) => [
    e.count === 1 ? "A URL variant ends elsewhere" : `${e.count} URL variants end elsewhere`,
    e.count === 1 ? "Варіант адреси веде деінде" : `${uk(e.count, "варіант адреси веде", "варіанти адреси ведуть", "варіантів адреси ведуть")} деінде`,
    e.count === 1 ? "Wariant adresu prowadzi gdzie indziej" : `${pl(e.count, "wariant adresu prowadzi", "warianty adresu prowadzą", "wariantów adresu prowadzi")} gdzie indziej`,
  ],
  hsts_missing: () => ["No HSTS header", "Немає заголовка HSTS", "Brak nagłówka HSTS"],
  html_not_compressed: (e) => [`HTML sent uncompressed · ${kb(e.bytes)} KB`, `HTML без стиснення · ${kb(e.bytes)} КБ`, `HTML bez kompresji · ${kb(e.bytes)} KB`],
  html_no_cache_control: () => ["No Cache-Control on the HTML", "Немає Cache-Control для HTML", "Brak Cache-Control dla HTML"],
  security_headers_missing: (e) => [
    en(e.missing.length, "security header missing", "security headers missing"),
    e.missing.length === 1 ? "Бракує заголовка безпеки" : `Бракує ${uk(e.missing.length, "заголовка", "заголовків", "заголовків")} безпеки`,
    e.missing.length === 1 ? "Brak nagłówka bezpieczeństwa" : `Brak ${pl(e.missing.length, "nagłówka", "nagłówków", "nagłówków")} bezpieczeństwa`,
  ],
  html_lang_invalid: (e) => [`html lang ${q(e.lang, 20)} is not a language code`, `html lang ${q(e.lang, 20)} не є кодом мови`, `html lang ${qPl(e.lang, 20)} nie jest kodem języka`],
  link_text_generic: (e) => [en(e.count, "link that says only “here” or “more”", "links that say only “here” or “more”"), `${uk(e.count, "посилання", "посилання", "посилань")} лише з «тут» чи «детальніше»`, `${pl(e.count, "link", "linki", "linków")} tylko z „tutaj” lub „więcej”`],
  image_link_alt_empty: (e) => [en(e.count, "image link with no name", "image links with no name"), `${uk(e.count, "посилання-зображення", "посилання-зображення", "посилань-зображень")} без назви`, `${pl(e.count, "link graficzny", "linki graficzne", "linków graficznych")} bez nazwy`],
  image_alt_repeated: (e) => [
    e.groups === 1 ? "Same alt on several images" : `Same alt on several images · ${e.groups}`,
    e.groups === 1 ? "Однаковий alt на кількох зображеннях" : `Однаковий alt на кількох зображеннях · ${e.groups}`,
    e.groups === 1 ? "Ten sam alt na kilku obrazach" : `Ten sam alt na kilku obrazach · ${e.groups}`,
  ],
  internal_nofollow: (e) => [en(e.count, "internal link marked nofollow", "internal links marked nofollow"), `${uk(e.count, "внутрішнє посилання", "внутрішні посилання", "внутрішніх посилань")} з nofollow`, `${pl(e.count, "link wewnętrzny", "linki wewnętrzne", "linków wewnętrznych")} z nofollow`],
  fragment_link_broken: (e) => [en(e.count, "#link to nothing on the page", "#links to nothing on the page"), `${uk(e.count, "посилання #", "посилання #", "посилань #")} в нікуди`, `${pl(e.count, "link #", "linki #", "linków #")} donikąd`],
  robots_no_sitemap: () => ["robots.txt names no sitemap", "robots.txt не називає sitemap", "robots.txt nie wskazuje sitemap"],
  sitemap_lastmod_invalid: (e) => [`${en(e.invalid + e.future, "bad lastmod date", "bad lastmod dates")} in the sitemap`, `${uk(e.invalid + e.future, "хибна дата", "хибні дати", "хибних дат")} lastmod у sitemap`, `${pl(e.invalid + e.future, "błędna data", "błędne daty", "błędnych dat")} lastmod w sitemap`],
  og_image_broken: () => ["Preview image does not load", "Зображення для прев’ю не завантажується", "Obraz podglądu się nie wczytuje"],
  author_missing: () => ["Article without an author", "Стаття без автора", "Artykuł bez autora"],
  about_contact_missing: (e) => [`No ${e.missing.join(" or ")} link`, `Немає посилання ${e.missing.map((k) => (k === "about" ? "«Про нас»" : "«Контакти»")).join(" чи ")}`, `Brak linku ${e.missing.map((k) => (k === "about" ? "„O nas”" : "„Kontakt”")).join(" ani ")}`],
  organization_details_missing: (e) => (e.found ? [`Organization lacks ${e.missing.join(", ")}`, `В Organization бракує ${e.missing.join(", ")}`, `W Organization brakuje: ${e.missing.join(", ")}`] : ["No Organization markup", "Немає розмітки Organization", "Brak znaczników Organization"]),
  article_date_missing: () => ["Article without a visible date", "Стаття без видимої дати", "Artykuł bez widocznej daty"],
  privacy_terms_missing: (e) => [`No ${e.missing.join(" or ")} link`, `Немає посилання на ${e.missing.map((k) => (k === "privacy" ? "конфіденційність" : "умови")).join(" чи ")}`, `Brak linku do ${e.missing.map((k) => (k === "privacy" ? "polityki prywatności" : "regulaminu")).join(" ani ")}`],
  date_mismatch: () => ["Markup date ≠ visible date", "Дата в розмітці ≠ видима дата", "Data w znacznikach ≠ widoczna data"],
  snippet_blocked: () => ["Snippets blocked", "Сніпети заборонено", "Snippety zablokowane"],
  markdown_alternate_broken: () => ["Markdown version does not load", "Markdown-версія не завантажується", "Wersja Markdown się nie wczytuje"],
  ai_catalog_invalid: () => ["ai-catalog.json does not parse", "ai-catalog.json не розбирається", "Błąd parsowania ai-catalog.json"],
  indexnow_key_broken: () => ["IndexNow key file missing", "Немає файлу ключа IndexNow", "Brak pliku klucza IndexNow"],
  spa_shell: (e) => [`Empty app shell · ${e.words} words without JavaScript`, `Порожня оболонка застосунку · ${uk(e.words, "слово", "слова", "слів")} без JavaScript`, `Pusta powłoka aplikacji · ${pl(e.words, "słowo", "słowa", "słów")} bez JavaScriptu`],
};

export const label = (f) => {
  const fn = LABELS[f.code];
  if (!fn) throw new Error(`no label for ${f.code}`);
  return fn(f.evidence || {});
};

export const SEV = {
  blocking: ["Blocking", "Блокувальна", "Blokujący"],
  high: ["High", "Висока", "Wysoki"],
  medium: ["Medium", "Середня", "Średni"],
  low: ["Low", "Низька", "Niski"],
};

export const OWNERS = { dev: ["Developer", "Розробник", "Programista"], content: ["Content", "Контент", "Treść"], seo: ["SEO", "SEO", "SEO"] };

/** The six status tiles, as the approved Lite prototype draws them. Markup sits in "Shown well in search?"; the questions, the writing patterns and the keyword in "AI quotes it right?"; brand and reviews in their own tile. */
export const AREAS = [
  { id: "classic", q: ["Shown well in search?", "Добре видно в пошуку?", "Dobrze widoczna w wyszukiwarce?"] },
  { id: "find", q: ["AI finds it?", "ШІ знаходить?", "AI ją znajduje?"] },
  { id: "read", q: ["AI reads all of it?", "ШІ читає все?", "AI czyta całość?"] },
  { id: "quote", q: ["AI quotes it right?", "ШІ цитує правильно?", "AI cytuje poprawnie?"] },
  { id: "brand", q: ["AI gets the brand right?", "ШІ правильно описує бренд?", "AI dobrze opisuje markę?"] },
  { id: "lang", q: ["Languages in order?", "Мови гаразд?", "Języki w porządku?"] },
];

/** The layer a finding comes from; a judgement carries the model that judged. */
export const LAYER = {
  measured: ["Measured", "Виміряно", "Zmierzono"],
  derived: ["Derived", "Обчислено", "Obliczono"],
  judgement: ["Agent's judgement", "Судження агента", "Ocena agenta"],
};

export const STATE = {
  ok: ["OK", "Гаразд", "OK"],
  prob: ["Problems", "Є проблеми", "Problemy"],
  block: ["Blocking", "Блокує", "Blokuje"],
  na: ["One version", "Одна версія", "Jedna wersja"],
  unchecked: ["Not checked", "Не перевірено", "Nie sprawdzono"],
};

export const MARK = {
  pass: { i: "✓", t: ["Passed", "Пройдено", "Zaliczone"] },
  fail: { i: "✕", t: ["Problem", "Проблема", "Problem"] },
  warn: { i: "!", t: ["Warning", "Увага", "Ostrzeżenie"] },
  na: { i: "—", t: ["Not measured", "Не виміряно", "Nie zmierzono"] },
  none: { i: "∅", t: ["Not on this page", "Немає на сторінці", "Brak na tej stronie"] },
};

export const ZONE_LABEL = {
  header: (z) => (z.hasNav ? ["Site header · navigation", "Шапка сайту · навігація", "Nagłówek serwisu · nawigacja"] : ["Site header", "Шапка сайту", "Nagłówek serwisu"]),
  nav: () => ["Navigation", "Навігація", "Nawigacja"],
  hero: (z) => (z.inHeader ? ["Hero · inside <header>", "Перший екран · у <header>", "Pierwszy ekran · w <header>"] : ["Hero", "Перший екран", "Pierwszy ekran"]),
  intro: () => ["Top of the content", "Початок вмісту", "Początek treści"],
  aside: () => ["Sidebar", "Бічна панель", "Panel boczny"],
  footer: () => ["Footer", "Підвал", "Stopka"],
  more: (z) => [`${z.merged} more sections`, `ще ${uk(z.merged, "розділ", "розділи", "розділів")}`, `jeszcze ${pl(z.merged, "sekcja", "sekcje", "sekcji")}`],
  untitled: () => ["Untitled section", "Розділ без назви", "Sekcja bez tytułu"],
};

export const UI = {
  eyebrow: ["AI search audit · Lite", "Аудит для ШІ-пошуку · Lite", "Audyt wyszukiwania AI · Lite"],
  langGroup: ["Language", "Мова", "Język"],
  themeGroup: ["Theme", "Тема", "Motyw"],
  dark: ["Dark", "Темна", "Ciemny"],
  light: ["Light", "Світла", "Jasny"],
  checked: [(d) => `checked ${d}`, (d) => `перевірено ${d}`, (d) => `sprawdzono ${d}`],
  statusAria: ["Status by question", "Стан за запитаннями", "Stan według pytań"],
  nothingFound: ["nothing found", "нічого не знайдено", "nic nie znaleziono"],
  oneVersion: ["no hreflang", "без hreflang", "bez hreflang"],
  noBrandFiles: ["no brand.json or reviews.json", "без brand.json і reviews.json", "bez brand.json i reviews.json"],
  modelNotStated: ["model not stated", "модель не вказано", "model nie podany"],
  oneModel: [
    (m) => `Brand, reviews and questions: one model's view (${m}), from its own knowledge, not ChatGPT, Gemini or Perplexity. The web Brandscope and Reviewscope ask three assistants.`,
    (m) => `Бренд, відгуки й запитання: погляд однієї моделі (${m}), з її власних знань, а не ChatGPT, Gemini чи Perplexity. Вебверсії Brandscope і Reviewscope питають трьох асистентів.`,
    (m) => `Marka, opinie i pytania: spojrzenie jednego modelu (${m}), z jego własnej wiedzy, a nie ChatGPT, Gemini czy Perplexity. Webowe Brandscope i Reviewscope pytają trzech asystentów.`,
  ],
  pageMap: ["Page map", "Мапа сторінки", "Mapa strony"],
  marked: [(n) => `${en(n, "problem", "problems")} marked`, (n) => `позначено ${uk(n, "проблему", "проблеми", "проблем")}`, (n) => `oznaczono ${pl(n, "problem", "problemy", "problemów")}`],
  mapAria: ["Map of the audited page, top to bottom, with numbered problem markers", "Мапа перевіреної сторінки згори донизу з пронумерованими маркерами проблем", "Mapa sprawdzonej strony od góry do dołu, z numerowanymi znacznikami problemów"],
  notSeen: ["AI does not see this", "ШІ цього не бачить", "AI tego nie widzi"],
  partSeen: [(p) => `${p}% unseen by AI`, (p) => `${p}% ШІ не бачить`, (p) => `${p}% niewidoczne dla AI`],
  onlyJs: ["Only with JavaScript", "Лише з JavaScript", "Tylko z JavaScriptem"],
  panelsHidden: [(n, c) => `${en(n, "panel", "panels")} hidden · ${fmtEn(c)} characters`, (n, c) => `${uk(n, "панель", "панелі", "панелей")} приховано · ${uk(c, "символ", "символи", "символів")}`, (n, c) => `ukryte panele: ${fmtPl(n)} · ${pl(c, "znak", "znaki", "znaków")}`],
  unmapped: [(n) => `+${n} not tied to one spot`, (n) => `+${n} не прив’язані до місця`, (n) => `+${n} bez przypisania do miejsca`],
  otherProblems: ["Other problems", "Інші проблеми", "Inne problemy"],
  more: [(n) => `+${n}`, (n) => `+${n}`, (n) => `+${n}`],
  biggest: ["Biggest problems", "Найбільші проблеми", "Największe problemy"],
  noProblems: ["No problems found", "Проблем не знайдено", "Nie znaleziono problemów"],
  severity: ["Severity", "Серйозність", "Waga"],
  problemsUnit: ["problems", "проблеми", "problemy"],
  text: ["Where the text goes", "Куди дівається текст", "Dokąd trafia tekst"],
  charsUnit: ["characters", "символи", "znaki"],
  wf: [["Raw HTML", "Сирий HTML", "Surowy HTML"], ["Removed", "Видалено", "Usunięto"], ["Kept", "Збережено", "Zachowano"], ["In passages", "В уривках", "We fragmentach"], ["Not in passages", "Не в уривках", "Poza fragmentami"], ["Past the cap", "За лімітом", "Poza limitem"]],
  passagesLine: [(n, cap) => `${n} of ${cap} passages`, (n, cap) => `${n} із ${cap} уривків`, (n, cap) => `${n} z ${cap} fragmentów`],
  bots: ["Bots in robots.txt", "Боти в robots.txt", "Boty w robots.txt"],
  path: [(p) => `path ${p}`, (p) => `шлях ${p}`, (p) => `ścieżka ${p}`],
  allowed: ["allowed", "дозволено", "dozwolony"],
  blocked: ["blocked", "заборонено", "zablokowany"],
  robotsNone: ["no robots.txt: all allowed", "robots.txt немає: усе дозволено", "brak robots.txt: wszystko dozwolone"],
  robotsUnreachable: ["robots.txt does not answer: assume all blocked", "robots.txt не відповідає: вважається, що все заборонено", "robots.txt nie odpowiada: przyjmujemy, że wszystko jest zablokowane"],
  robotsNotChecked: ["robots.txt not measured", "robots.txt не виміряно", "Nie zmierzono robots.txt"],
  llmsNote: [
    "Google documents no use of llms.txt: “You don't need to create new machine readable files, AI text files, or markup to appear in these features.”",
    "Google не документує використання llms.txt: «You don't need to create new machine readable files, AI text files, or markup to appear in these features.»",
    "Google nie dokumentuje żadnego użycia llms.txt: „You don't need to create new machine readable files, AI text files, or markup to appear in these features.”",
  ],
  llmsNoteSource: ["Google Search Central: AI features and your website", "Google Search Central: AI features and your website", "https://developers.google.com/search/docs/appearance/ai-features", "Google Search Central: AI features and your website"],
  kind: { search: ["search", "пошук", "wyszukiwanie"], user: ["a user's question", "запит користувача", "pytanie użytkownika"], training: ["training", "навчання", "trenowanie"], index: ["web index", "вебіндекс", "indeks wyszukiwarki"] },
  classic: ["Google and Bing checks", "Перевірки Google і Bing", "Sprawdzenia Google i Bing"],
  checksUnit: [(n) => `${n} checks`, (n) => `${uk(n, "перевірка", "перевірки", "перевірок")}`, (n) => pl(n, "sprawdzenie", "sprawdzenia", "sprawdzeń")],
  sum: {
    pass: [(n) => `${n} passed`, (n) => `${uk(n, "пройдена", "пройдені", "пройдених")}`, (n) => pl(n, "zaliczone", "zaliczone", "zaliczonych")],
    fail: [(n) => en(n, "problem", "problems"), (n) => uk(n, "проблема", "проблеми", "проблем"), (n) => pl(n, "problem", "problemy", "problemów")],
    warn: [(n) => en(n, "warning", "warnings"), (n) => uk(n, "попередження", "попередження", "попереджень"), (n) => pl(n, "ostrzeżenie", "ostrzeżenia", "ostrzeżeń")],
    na: [(n) => `${n} not measured`, (n) => `${fmtUk(n)} не ${ukForm(n, "виміряна", "виміряні", "виміряних")}`, (n) => pl(n, "niezmierzone", "niezmierzone", "niezmierzonych")],
    none: [(n) => `${n} not on this page`, (n) => `${fmtUk(n)} немає на сторінці`, (n) => `${pl(n, "nieobecne", "nieobecne", "nieobecnych")} na tej stronie`],
  },
  langs: ["Language versions", "Мовні версії", "Wersje językowe"],
  versionsUnit: [(n) => en(n, "version", "versions"), (n) => uk(n, "версія", "версії", "версій"), (n) => pl(n, "wersja", "wersje", "wersji")],
  langCols: [["Title", "Title", "Title"], ["Description", "Опис", "Opis"], ["hreflang", "hreflang", "hreflang"], ["Same facts", "Ті самі факти", "Te same fakty"]],
  langCol: ["Lang", "Мова", "Język"],
  langOne: ["One language version: the page declares no hreflang.", "Одна мовна версія: сторінка не оголошує hreflang.", "Jedna wersja językowa: strona nie deklaruje hreflang."],
  langUnread: [(n, cap) => `+${n} not read (cap ${cap})`, (n, cap) => `+${n} не прочитано (ліміт ${cap})`, (n, cap) => `+${n} nieprzeczytanych (limit ${cap})`],
  langRefused: ["not analysed", "не аналізується", "nie analizowano"],
  thisPage: ["this page", "ця сторінка", "ta strona"],
  xDefault: ["x-default", "x-default", "x-default"],
  cannot: ["What this check cannot see", "Чого ця перевірка не бачить", "Czego to sprawdzenie nie widzi"],
  full: ["Full report with explanations →", "Повний звіт із поясненнями →", "Pełny raport z wyjaśnieniami →"],
  caps: ["Not checked", "Не перевірено", "Nie sprawdzono"],
  footer: [
    "Made with the ai-search-audit skill (Lite) by GetLoopLoop: the scripts fetched the page, its robots.txt, sitemap, llms.txt and language versions, and up to 30 of its links, and sent nothing anywhere; the judgement parts are the agent's model.",
    "Зроблено навичкою ai-search-audit (Lite) від GetLoopLoop: скрипти завантажили сторінку, її robots.txt, sitemap, llms.txt і мовні версії та до 30 її посилань і нікуди нічого не надсилали; частини із судженнями — це модель агента.",
    "Utworzono za pomocą umiejętności ai-search-audit (Lite) od GetLoopLoop: skrypty pobrały stronę, jej robots.txt, sitemap, llms.txt i wersje językowe oraz do 30 jej linków i nigdzie niczego nie wysłały; części z ocenami pochodzą od modelu agenta.",
  ],
  footerRefused: [
    "Made with the ai-search-audit skill (Lite) by GetLoopLoop: the scripts fetched the page once and kept nothing of it.",
    "Зроблено навичкою ai-search-audit (Lite) від GetLoopLoop: скрипти один раз завантажили сторінку й нічого з неї не зберегли.",
    "Utworzono za pomocą umiejętności ai-search-audit (Lite) od GetLoopLoop: skrypty pobrały stronę raz i niczego z niej nie zachowały.",
  ],
  author: ["the author", "автор", "autor"],
  refusedEyebrow: ["AI search audit · Lite", "Аудит для ШІ-пошуку · Lite", "Audyt wyszukiwania AI · Lite"],
};

/** "What this check cannot see": one line each, with where to get it. Brand, reviews and questions are in Lite as one model's view; several assistants are the web tools. */
export const CANNOT = [
  { t: ["Descriptions of each problem and directions to fix it", "Опис кожної проблеми й напрям виправлення", "Opis każdego problemu i wskazówki, jak go naprawić"], links: [["Full version from GetLoopLoop", "Повна версія від GetLoopLoop", "https://www.getlooploop.com", "Pełna wersja od GetLoopLoop"]] },
  { t: ["What real assistants (ChatGPT, Gemini, Perplexity) say about your brand and reviews", "Що справжні асистенти (ChatGPT, Gemini, Perplexity) кажуть про ваш бренд і відгуки", "Co prawdziwi asystenci (ChatGPT, Gemini, Perplexity) mówią o Twojej marce i opiniach"], links: [["Brandscope", "Brandscope", "https://www.getlooploop.com/brandscope", "Brandscope"], ["Reviewscope", "Reviewscope", "https://www.getlooploop.com/reviewscope", "Reviewscope"]] },
  { t: ["How their answers change from day to day", "Як їхні відповіді змінюються з дня на день", "Jak ich odpowiedzi zmieniają się z dnia na dzień"], links: [["AI answer volatility", "Мінливість відповідей ШІ", "https://www.getlooploop.com/ai-volatility", "Zmienność odpowiedzi AI"]] },
  { t: ["How AI groups your text by meaning (embeddings)", "Як ШІ групує ваш текст за змістом (ембединги)", "Jak AI grupuje Twój tekst według znaczenia (embeddingi)"], links: [["Vectorscope", "Vectorscope", "https://www.getlooploop.com/vectorscope", "Vectorscope"]] },
  { t: ["Search Console data, real-user speed, sites over 50 pages, tracking over time", "Дані Search Console, швидкість у реальних користувачів, сайти понад 50 сторінок, відстеження в часі", "Dane z Search Console, szybkość u prawdziwych użytkowników, witryny powyżej 50 stron, śledzenie w czasie"], links: [["GetLoopLoop", "GetLoopLoop", "https://www.getlooploop.com", "GetLoopLoop"]] },
];

/** The verdict line at the top. */
export function verdict(findings) {
  const blocking = findings.filter((f) => f.severity === "blocking").length;
  const hides = findings.filter((f) => f.hides).length;
  if (blocking) return [blocking === 1 ? "1 problem blocks search or AI" : `${blocking} problems block search or AI`, `${uk(blocking, "проблема блокує", "проблеми блокують", "проблем блокують")} пошук або ШІ`, `${pl(blocking, "problem blokuje", "problemy blokują", "problemów blokuje")} wyszukiwarkę lub AI`];
  if (hides) return [hides === 1 ? "1 problem hides text from AI" : `${hides} problems hide text from AI`, `${uk(hides, "проблема ховає", "проблеми ховають", "проблем ховають")} текст від ШІ`, `${pl(hides, "problem ukrywa", "problemy ukrywają", "problemów ukrywa")} tekst przed AI`];
  if (findings.some((f) => f.severity !== "low")) return ["Nothing hides text from AI", "Ніщо не ховає текст від ШІ", "Nic nie ukrywa tekstu przed AI"];
  return findings.length ? ["Only minor notes", "Лише дрібні зауваження", "Tylko drobne uwagi"] : ["No problems found", "Проблем не знайдено", "Nie znaleziono problemów"];
}

export const nProblems = (n) => [en(n, "problem", "problems"), uk(n, "проблема", "проблеми", "проблем"), pl(n, "problem", "problemy", "problemów")];
export const nMinor = (n) => [n === 1 ? "1 minor note" : `${n} minor notes`, uk(n, "дрібне зауваження", "дрібні зауваження", "дрібних зауважень"), pl(n, "drobna uwaga", "drobne uwagi", "drobnych uwag")];

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_UK = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
/** Polish month names in the genitive, as a date is written: "17 października 2026". */
const MONTHS_PL = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
/** A date in all three languages, in the local time of the machine that ran the audit. */
export function dateOf(iso) {
  const d = new Date(iso);
  return [`${d.getDate()} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`, `${d.getDate()} ${MONTHS_UK[d.getMonth()]} ${d.getFullYear()}`, `${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`];
}

// ── 2.103: the summary-first layout ──────────────────────────────────────────

const MONTHS_EN_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "17 October 2026" / "17 жовтня 2026" / "17 października 2026", for the line under the URL. */
export function dateLong(iso) {
  const d = new Date(iso);
  return [`${d.getDate()} ${MONTHS_EN_LONG[d.getMonth()]} ${d.getFullYear()}`, `${d.getDate()} ${MONTHS_UK[d.getMonth()]} ${d.getFullYear()}`, `${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`];
}

const joinEn = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const joinUk = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} та ${xs[xs.length - 1]}`);
const joinPl = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} i ${xs[xs.length - 1]}`);
const notesEn = (n) => (n ? en(n, "note", "notes") : "no notes");
const notesUk = (n) => (n ? uk(n, "зауваження", "зауваження", "зауважень") : "зауважень немає");
const notesPl = (n) => (n ? pl(n, "uwaga", "uwagi", "uwag") : "brak uwag");

/** The blocking codes the headline names. */
export const BLOCKS = { index: ["noindex"], robots: ["search_engine_blocked", "robots_unreachable"], ai: ["ai_search_blocked"] };

/** The big headline: what blocks the page, or that it is reachable, and how many notes there are. Built from the findings only. */
export function headline(findings) {
  const has = (codes) => findings.some((f) => codes.includes(f.code));
  const n = findings.length;
  const tail = n ? [`${notesEn(n)}.`, `Є ${notesUk(n)}.`, `${notesPl(n)}.`] : ["No notes.", "Зауважень немає.", "Brak uwag."];
  let lead = null;
  if (has(BLOCKS.index) && has(BLOCKS.robots)) lead = ["robots.txt and noindex block the page.", "robots.txt і noindex блокують сторінку.", "robots.txt i noindex blokują stronę."];
  else if (has(BLOCKS.index)) lead = ["The page asks search not to index it.", "Сторінка просить пошук не індексувати її.", "Strona prosi wyszukiwarki, by jej nie indeksowały."];
  else if (has(BLOCKS.robots)) lead = ["robots.txt blocks search robots.", "robots.txt блокує пошукових роботів.", "robots.txt blokuje roboty wyszukiwarek."];
  else if (has(BLOCKS.ai)) lead = ["robots.txt blocks AI search robots.", "robots.txt блокує роботів ШІ-пошуку.", "robots.txt blokuje roboty wyszukiwania AI."];
  else if (findings.some((f) => f.severity === "blocking")) lead = ["Something blocks the page.", "Щось блокує сторінку.", "Coś blokuje stronę."];
  const blocked = Boolean(lead);
  lead ||= ["The page is reachable.", "Сторінка доступна.", "Strona jest dostępna."];
  return { blocked, t: [`${lead[0]} ${tail[0]}`, `${lead[1]} ${tail[1]}`, `${lead[2]} ${tail[2]}`] };
}

/** What each area is called inside a sentence, in the subtitle's "worth reviewing" list. */
export const AREA_TOPIC = {
  classic: ["the Google and Bing basics", "базові перевірки Google і Bing", "podstawy Google i Bing"],
  find: ["robot access", "доступ роботів", "dostęp robotów"],
  read: ["how the text is read", "читання тексту", "sposób czytania tekstu"],
  quote: ["quoting and answers to questions", "цитування й відповіді на запитання", "cytowanie i odpowiedzi na pytania"],
  brand: ["the brand description", "опис бренду", "opis marki"],
  lang: ["the language versions", "мовні версії", "wersje językowe"],
};

/** One or two sentences under the headline, naming the areas with problems above low. */
export function subtitle(findings, blocked) {
  const first = blocked
    ? ["Start with the block: until it is lifted, the other notes matter less.", "Почніть із блокування: доки його не знято, решта зауважень важить менше.", "Zacznij od blokady: dopóki jej nie usuniesz, pozostałe uwagi mają mniejsze znaczenie."]
    : ["The check found nothing that blocks robots.", "Перевірка не знайшла блокування для роботів.", "Sprawdzenie nie znalazło niczego, co blokuje roboty."];
  const areas = AREAS.map((a) => a.id).filter((id) => findings.some((f) => f.area === id && f.severity !== "low" && f.severity !== "blocking"));
  let second = null;
  if (areas.length) second = [`Worth reviewing: ${joinEn(areas.map((a) => AREA_TOPIC[a][0]))}.`, `Варто переглянути ${joinUk(areas.map((a) => AREA_TOPIC[a][1]))}.`, `Warto przejrzeć: ${joinPl(areas.map((a) => AREA_TOPIC[a][2]))}.`];
  else if (findings.some((f) => f.severity === "low")) second = ["The other notes are minor.", "Решта зауважень дрібні.", "Pozostałe uwagi są drobne."];
  return second ? [`${first[0]} ${second[0]}`, `${first[1]} ${second[1]}`, `${first[2]} ${second[2]}`] : first;
}

/** "7 medium" / "7 середніх" / "7 średnich": a count with its severity word, for the row under the headline. */
export const SEV_COUNT = {
  blocking: [(n) => `${fmtEn(n)} blocking`, (n) => uk(n, "блокувальна", "блокувальні", "блокувальних"), (n) => pl(n, "blokujący", "blokujące", "blokujących")],
  high: [(n) => `${fmtEn(n)} high`, (n) => uk(n, "висока", "високі", "високих"), (n) => pl(n, "wysoki", "wysokie", "wysokich")],
  medium: [(n) => `${fmtEn(n)} medium`, (n) => uk(n, "середня", "середні", "середніх"), (n) => pl(n, "średni", "średnie", "średnich")],
  low: [(n) => `${fmtEn(n)} low`, (n) => uk(n, "низька", "низькі", "низьких"), (n) => pl(n, "niski", "niskie", "niskich")],
};

/** The three "what it means for you" cards. */
export const CARD_COPY = {
  find: {
    title: { ok: ["Robots can find it", "Роботи можуть знайти", "Roboty mogą ją znaleźć"], block: ["Robots are blocked", "Роботам закрито доступ", "Roboty są zablokowane"] },
    status: {
      none: ["No blocks found", "Блокування не знайдено", "Nie znaleziono blokad"],
      notes: [(n) => `No blocks found · ${notesEn(n)} on search`, (n) => `Блокування не знайдено · ${notesUk(n)} щодо пошуку`, (n) => `Nie znaleziono blokad · uwagi o wyszukiwaniu: ${fmtPl(n)}`],
      block: [(l) => `Blocked: ${l}`, (l) => `Заблоковано: ${l}`, (l) => `Zablokowano: ${l}`],
    },
  },
  text: {
    title: { ok: ["The text reads in full", "Текст читається повністю", "Tekst czyta się w całości"], notes: ["Part of the text to check", "Частину тексту слід перевірити", "Część tekstu do sprawdzenia"], hides: ["Part of the text is hidden from AI", "Частину тексту ШІ не бачить", "Część tekstu jest ukryta przed AI"] },
    status: { none: ["Nothing found", "Нічого не знайдено", "Nic nie znaleziono"], notes: [(n) => `${notesEn(n)} on reading`, (n) => `${notesUk(n)} до читання`, (n) => `Uwagi o czytaniu: ${fmtPl(n)}`] },
  },
  brand: {
    title: {
      na: ["Brand and questions", "Бренд і запитання", "Marka i pytania"],
      ok: ["Brand and questions: no notes", "Бренд і запитання: без зауважень", "Marka i pytania: bez uwag"],
      brand: ["Brand description needs attention", "Опис бренду потребує уваги", "Opis marki wymaga uwagi"],
      questions: ["Answers to questions need attention", "Відповіді на запитання потребують уваги", "Odpowiedzi na pytania wymagają uwagi"],
    },
    status: {
      na: ["Not checked: no brand, reviews or questions file", "Не перевірено: немає файлів бренду, відгуків чи запитань", "Nie sprawdzono: brak pliku marki, opinii ani pytań"],
      ok: ["The model's answers match the page", "Відповіді моделі збігаються зі сторінкою", "Odpowiedzi modelu zgadzają się ze stroną"],
      unknown: ["The model did not recognise the brand", "Модель не впізнала бренд", "Model nie rozpoznał marki"],
      notes: [(n) => `${notesEn(n)} from one model`, (n) => `${notesUk(n)} від однієї моделі`, (n) => `Uwagi jednego modelu: ${fmtPl(n)}`],
    },
  },
};

export const LITE = {
  checked: [(d) => `Checked ${d}`, (d) => `Перевірено ${d}`, (d) => `Sprawdzono ${d}`],
  about: ["About this check", "Про цю перевірку", "O tym sprawdzeniu"],
  seeFindings: ["See the main findings", "Переглянути головні знахідки", "Zobacz główne ustalenia"],
  means: ["What it means for you", "Що це означає для вас", "Co to oznacza dla Ciebie"],
  cardsAria: ["Summary in three cards", "Підсумок у трьох картках", "Podsumowanie w trzech kartach"],
  cardsNote: [
    [(m) => `The first two cards come from the page data. The third is one model's estimate (${m}).`, (m) => `Перші дві картки — за даними сторінки. Третя — оцінка однієї моделі (${m}).`, (m) => `Dwie pierwsze karty opierają się na danych strony. Trzecia to szacunek jednego modelu (${m}).`],
    ["The first two cards come from the page data. The third needs the agent's brand, reviews or questions file.", "Перші дві картки — за даними сторінки. Для третьої потрібен файл агента з оцінкою бренду, відгуків чи запитань.", "Dwie pierwsze karty opierają się na danych strony. Trzecia wymaga pliku agenta z oceną marki, opinii lub pytań."],
  ],
  first: ["Review these first", "Спочатку перегляньте ці знахідки", "Najpierw przejrzyj te ustalenia"],
  showPlace: ["Show place", "Показати місце", "Pokaż miejsce"],
  showInList: ["Show in the list", "Показати у списку", "Pokaż na liście"],
  examples: ["Examples of questions", "Приклади запитань", "Przykłady pytań"],
  aboutEstimate: ["About this estimate", "Про цю оцінку", "O tym szacunku"],
  modelLine: [(m) => `Model: ${m}`, (m) => `Модель: ${m}`, (m) => `Model: ${m}`],
  notThree: ["the agent's estimate, not a check of three assistants", "оцінка агента, не перевірка трьох асистентів", "szacunek agenta, a nie sprawdzenie trzech asystentów"],
  notInText: ["Not found in the text", "Не знайдено у тексті", "Nie znaleziono w tekście"],
  wholePage: ["The whole page", "Уся сторінка", "Cała strona"],
  where: ["Where on the page", "Де на сторінці це знайдено", "Gdzie na stronie"],
  schemaNote: ["A schema of the document, not a screenshot of the page.", "Схема документа, а не скріншот сторінки.", "Schemat dokumentu, a nie zrzut ekranu strony."],
  placesAria: ["Places in the document, top to bottom", "Місця в документі згори донизу", "Miejsca w dokumencie od góry do dołu"],
  selected: ["Selected place", "Обране місце", "Wybrane miejsce"],
  found: ["Found", "Знайдено", "Znaleziono"],
  nothingHere: ["Nothing found here", "Тут нічого не знайдено", "Nic tu nie znaleziono"],
  exact: ["Show exact place", "Показати точне місце", "Pokaż dokładne miejsce"],
  path: ["Path in the document", "Шлях у документі", "Ścieżka w dokumencie"],
  copy: ["Copy", "Копіювати", "Kopiuj"],
  copied: ["Copied", "Скопійовано", "Skopiowano"],
  rows: [(n) => en(n, "row", "rows"), (n) => uk(n, "рядок", "рядки", "рядків"), (n) => pl(n, "wiersz", "wiersze", "wierszy")],
  notRead: ["Not read by the reader", "Не прочитано читачем", "Czytnik tego nie przeczytał"],
  partRead: [(p) => `${p}% not read by the reader`, (p) => `${p}% не прочитано читачем`, (p) => `${p}% nieprzeczytane przez czytnik`],
  all: ["All checks and technical details", "Усі перевірки та технічні подробиці", "Wszystkie sprawdzenia i szczegóły techniczne"],
  allSub: ["Robot access · Google and Bing · Languages · Reading the text", "Доступ роботів · Google і Bing · Мови · Читання тексту", "Dostęp robotów · Google i Bing · Języki · Odczyt tekstu"],
  areas: ["Status by area", "Стан за напрямами", "Stan według obszarów"],
  allFindings: ["All findings", "Усі знахідки", "Wszystkie ustalenia"],
  strips: ["<head> and robots.txt", "<head> і robots.txt", "<head> i robots.txt"],
  info: ["This is a check of one page, not a guarantee of how it shows in search. The brand and questions estimate reflects one model's view.", "Це перевірка однієї сторінки, а не гарантія показу в пошуку. Оцінка бренду й запитань відображає погляд однієї моделі.", "To sprawdzenie jednej strony, a nie gwarancja tego, jak pokaże się w wyszukiwarce. Szacunek dotyczący marki i pytań odzwierciedla zdanie jednego modelu."],
  measured: ["Measured", "Виміряно", "Zmierzono"],
  measuredSub: ["from the page data", "за даними сторінки", "na podstawie danych strony"],
  estimate: ["Model's estimate", "Оцінка моделі", "Szacunek modelu"],
  estimateSub: ["one model's answers", "відповіді однієї моделі", "odpowiedzi jednego modelu"],
  full: ["Full report with explanations", "Повний звіт із поясненнями", "Pełny raport z objaśnieniami"],
  tagline: ["AI search that understands your business", "AI пошук, який розуміє ваш бізнес", "Wyszukiwanie AI, które rozumie Twój biznes"],
  product: "AI Search Audit · Lite",
};
