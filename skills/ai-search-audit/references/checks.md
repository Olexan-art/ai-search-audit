# The checks: codes, rules and thresholds

Read this when you need what a finding code means, its tile, its severity or its threshold, for example when the user asks about 1 finding or what was not checked.

## Findings

Each finding has: a code; a severity (`blocking`, `high`, `medium`, `low`); a tile; an owner (developer, content, SEO); a layer (measured: a script counted it; derived: a fixed formula over measured values; judgement: your model, with `agent` and `model`); the place; the evidence; and its rule sources (in the export). The map counts findings not tied to 1 spot (most brand, review and question findings, several site checks) as "+N not tied to one spot".

| Tile | Codes |
|---|---|
| Shown well in search? | `not_https`, `title_missing` (high); `h1_missing`, `canonical_other`, `canonical_multiple`, `broken_links`, `viewport_missing`, `jsonld_invalid`, `schema_required_missing`, `image_lcp_lazy`, `image_oversized`, `mixed_content`, `soft_404`, `url_variants_inconsistent` (medium); `redirect_chain`, `sitemap_missing`, `sitemap_not_listed`, `title_too_long`, `title_too_short`, `meta_description_missing`, `meta_description_short`, `meta_description_long`, `h1_multiple`, `heading_order_skip`, `canonical_missing`, `canonical_relative`, `internal_links_none`, `image_alt_missing`, `image_dimensions_missing`, `image_not_lazy`, `image_legacy_format`, `image_no_srcset`, `html_lang_missing`, `social_tags_missing`, `page_weight_heavy`, `script_render_blocking`, `image_preload_lazy`, `image_fetchpriority_overused`, `url_unreadable`, `schema_recommended_missing`, `favicon_missing`, `site_name_missing`, `hsts_missing`, `author_missing`, `about_contact_missing`, `organization_details_missing`, `article_date_missing`, `privacy_terms_missing`, `date_mismatch`, `html_not_compressed`, `html_lang_invalid`, `link_text_generic`, `image_link_alt_empty`, `image_alt_repeated`, `internal_nofollow`, `fragment_link_broken`, `robots_no_sitemap`, `sitemap_lastmod_invalid`, `og_image_broken` (low); `structured_data_none`, `faq_rich_result_retired`, `rich_result_retired`, `html_no_cache_control`, `security_headers_missing` (low, informational) |
| AI finds it? | `robots_unreachable`, `search_engine_blocked`, `ai_search_blocked`, `noindex` (blocking); `snippet_blocked` (high); `markdown_alternate_broken`, `ai_catalog_invalid`, `indexnow_key_broken` (low); `ai_training_blocked`, `llms_txt_missing` (low, informational) |
| AI reads all of it? | `cap_overflow`, `js_dependent`, `hero_lede_dropped`, `hidden_headings`, `spa_shell` (high; hidden headings are medium when the hidden text is short); `ssr_placeholder_text`, `h1_glued_words`, `nav_in_content`, `dominant_heading` (medium); `thin_section` (low) |
| AI quotes it right? | `faq_schema_not_visible`, `lost_faq_questions` (high); `mid_sentence_start`, `question_missing`, `keyword_not_in_title`, `keyword_variant_split`, `keyword_one_section` (medium); `truncated_teaser`, `repeated_claim`, `question_partial`, `off_keyword_share`, `promise_without_number`, `stock_phrases`, `repeated_sentence_shape`, `uniform_openings`, `unchecked_claims` (low; the writing patterns are medium when they recur, stock phrases from 2.0 per 1,000 words) |
| AI gets the brand right? | `brand_contradiction`, `review_rating_unbacked`, `review_control_hallucination` (high); `brand_fact_absent`, `brand_unknown`, `reviews_without_markup` (medium) |
| Languages in order? | `hreflang_no_return` (high); `hreflang_invalid_code`, `hreflang_no_self`, `hreflang_alternate_broken`, `title_duplicate_locales`, `locale_facts_differ` (medium); `description_duplicate_locales`, `hreflang_lang_mismatch`, `hreflang_no_x_default`, `llms_txt_one_language` (low) |

## How the checks work

**Passages.** The passage checks are the Vectorscope skill's, unchanged: h2 sections, 2,000-character windows, a cap of 26 passages. `repeated_claim` and the keyword's "one section" group by the page's h2 sections, so they need no embeddings.

**Google and Bing checklist.** 35 cells. Core Web Vitals and "in Google's index" are always *not measured*: they need field data and Search Console.

**Writing patterns.** The GetLoopLoop PatternScope's deterministic detectors over the kept text: stock phrases (a list per language), repeated sentence shapes, runs of sentences that open the same way, and evaluative claims with nothing checkable. Each has a position (passage and word) and a density per 1,000 words. Only English, Ukrainian and Spanish are analysed. They are signals of worn writing, not an AI detector. The report's last block, *How generated the text sounds*, shows the score, the marker words (vocabulary models overuse, counted beside the score, never inside it) and your swap test.

**The keyword.** `--keyword` when given; else the h1 without the site's name, a trailing year, a sales tail, a clause after a comma or colon, and edge stop words, at most 5 words. The report names the source. The promise-without-a-figure rule reads English only, and says so.

**Locale facts.** The script compares the numbers in each h2 section across language versions, aligned by order, only when both have the same number of sections; otherwise the version is listed as not compared. Numbers written as words are not read. A number may differ on purpose (a local price).

**Hidden content.** An element with `hidden` (or `aria-hidden="true"`, or an inline `display:none` / `visibility:hidden`) is hidden. `hidden="until-found"`, in any case, is not: the browser keeps that text in the page, finds it with find-in-page and opens it for a text-fragment link, so its headings are not `hidden_headings` and the Vectorscope reading keeps its text. A closed `<details>` is not hidden either. Source: modern-web-guidance, [search hidden content](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/ui-behaviors/search-hidden-content.md).

**Loading priorities.** These rest on modern-web-guidance, guides for building pages (not a search-ranking rule):

- `script_render_blocking` (low): an external classic `<script src>` in `<head>` with no `async`, `defer` or `type="module"`; a `nomodule` script is not counted, because browsers that run modules skip it. The finding lists the first 6 addresses and `more` counts the rest. Consent managers and A/B-test snippets are often blocking on purpose: say so before advising to move them. Source: [optimize script priority](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/performance/optimize-script-priority.md).
- `image_preload_lazy` (low): `<link rel="preload" as="image">` (its `href` or `imagesrcset`) names an image that the same page marks `loading="lazy"`. Source: [optimize preload priority](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/performance/optimize-preload-priority.md), [optimize image priority](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/performance/optimize-image-priority.md).
- `image_fetchpriority_overused` (low): `fetchpriority="high"` on more than 2 images; the guide says at most 1-2. A missing `fetchpriority` is never a finding: fetch priority is Baseline newly available, not widely available. Source: [optimize image priority](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/performance/optimize-image-priority.md).
- `image_lcp_lazy`, `image_not_lazy` keep web.dev as their source and also cite [optimize image priority](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/performance/optimize-image-priority.md).

**Structured data.** The script parses JSON-LD and lists microdata and RDFa types.

- Required properties (per Google's pages): FAQPage, Product, SoftwareApplication (and WebApplication, MobileApplication), BreadcrumbList, Event, JobPosting, LocalBusiness, VideoObject, QAPage, WebSite, ProductGroup, Offer, AggregateOffer, Review and AggregateRating.
- Recommended properties: the types above, and Article (NewsArticle, BlogPosting), Organization and Person.
- Every FAQPage question must appear in the visible text.
- Rich results Google retired are informational, dated by their entry on https://developers.google.com/search/updates: FAQ (7 May 2026), How-to (14 September 2023), course info, estimated salary and vehicle listing (documentation removed 9 September 2025), ClaimReview (phased out 12 June 2025), special announcement (31 July 2025), practice problem (6 January 2026) and the sitelinks search box (29 November 2024).

**llms.txt.** The report says that Google documents no use of it, and quotes Google's AI features page: "You don't need to create new machine readable files, AI text files, or markup to appear in these features."

**AI crawlers.** The script matches robots.txt by RFC 9309 (the Vectorscope skill's parser) for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Googlebot, Bingbot and CCBot. A 4xx robots.txt means no rules. A 5xx or no answer means everything is assumed disallowed.

## This skill's own thresholds

Each is a named constant with its reason, in `scripts/lib/`.

- Title: 10 to 60 characters. Meta description: 70 to 160.
- Redirect chain: 2 or more hops.
- Heavy page: HTML over 500 KB, or more than 30 scripts.
- Hard-to-read URL: over 115 characters, more than 2 query parameters, or a session id.
- Hidden headings: high from 200 hidden characters.
- Image: oversized over 200 KB; wants a srcset over 100 KB or from 800 px declared width.
- Above the fold: the hero and at most its first 2 images; the first is the LCP candidate.
- `data-nosnippet` blocks snippets when it covers half the visible text.
- App shell: under 150 words, with an app root (`#root`, `#__next`, `#app`, …) under 200 characters.
- Stock phrases: medium from 2.0 per 1,000 words.
- Keyword: off-phrase floor is half the passage text; "one section" is a third of the sections or fewer, from 3 sections.

## Verifier rubrics

Some checks fire on pages that are fine: a script sees markup, not intent. For these codes, read the page before you present the finding and check which clause holds. The export carries the same clauses with each finding (`findings[].rubric`, from `scripts/lib/rubrics.mjs`).

- When a **keepWhen** clause holds, present the finding as it is.
- When a **dropWhen** clause holds, still list the finding, and tell the user which clause you believe holds, by its id (for example `script_render_blocking:drop-1`). Never delete a finding from the report or the export; the scripts do not accept a drop.
- When neither is clear, present the finding and say what you could not tell.

### `image_lcp_lazy`

keepWhen:

- `image_lcp_lazy:keep-1` The lazy image is the first content image people see at the top of the page: a hero, a product photo, an article's lead image.
- `image_lcp_lazy:keep-2` The image is large enough to be the largest element on the first screen.

dropWhen:

- `image_lcp_lazy:drop-1` The image is a logo, an icon or an avatar, smaller than the text beside it, so it cannot be the largest element.
- `image_lcp_lazy:drop-2` The image is in a carousel slide, a tab or a menu that is not shown when the page loads.
- `image_lcp_lazy:drop-3` A larger element clearly fills the first screen instead: a text block, a video poster, a CSS background.

### `hidden_headings`

keepWhen:

- `hidden_headings:keep-1` The hidden panel holds content the page is about: product details, a comparison, FAQ answers, a tab of specifications.
- `hidden_headings:keep-2` The panel is hidden with the hidden attribute, aria-hidden="true" or an inline display:none, not with hidden="until-found" or a closed <details> (those are not reported).

dropWhen:

- `hidden_headings:drop-1` The panel repeats content that is visible elsewhere on the page, such as a mobile copy of a desktop table.
- `hidden_headings:drop-2` The panel is a dialog, a form step, a confirmation or an error message that only matters after an action.
- `hidden_headings:drop-3` The headings label an off-canvas menu, a cookie panel or another piece of furniture, not content.

### `nav_in_content`

keepWhen:

- `nav_in_content:keep-1` The short lines are menu items, tag lists, breadcrumbs, share buttons or link lists inside the main text.

dropWhen:

- `nav_in_content:drop-1` The short lines are content the page is about: product names, specifications, a list of values.
- `nav_in_content:drop-2` The short lines are verse, lyrics, an address block or code.

### `script_render_blocking`

keepWhen:

- `script_render_blocking:keep-1` The script is a library, a widget, analytics, a chat or a framework bundle that does not have to run before the first paint.

dropWhen:

- `script_render_blocking:drop-1` The script is a consent manager that must run before any other tag loads.
- `script_render_blocking:drop-2` The script is an anti-flicker A/B-testing snippet that keeps the page hidden until the variant is applied.
- `script_render_blocking:drop-3` The script sets the colour theme or the language before the first paint, so the page does not flash in the wrong one.

### `link_text_generic`

keepWhen:

- `link_text_generic:keep-1` The link text alone ("here", "read more") names nothing, and the sentence, list item or table cell around it does not name the target either.

dropWhen:

- `link_text_generic:drop-1` The sentence, list item or table cell that holds the link names its target, which WCAG 2.4.4 (link purpose in context) accepts.

### `dominant_heading`

keepWhen:

- `dominant_heading:keep-1` The text under the heading covers several subtopics, each of which could answer a question of its own.

dropWhen:

- `dominant_heading:drop-1` The section is one continuous topic (a single procedure, a story, a legal text) that subheadings would cut apart.
- `dominant_heading:drop-2` The page is short and holds one answer by design, such as a definition.
