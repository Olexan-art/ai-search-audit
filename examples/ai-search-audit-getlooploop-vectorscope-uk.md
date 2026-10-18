# AI Search Audit Lite: https://www.getlooploop.com/uk/vectorscope

Семантичне розбиття сторінки — Vectorscope · checked 17 Oct 2026 · skill 2.109

**Nothing hides text from AI** · 21 problems (blocking 0, high 0, medium 8, low 13)

Lite lists problems, not fixes: labels, severities and places. The checks are deterministic (measured or derived); the questions, the brand and the reviews are the agent's judgement, marked as such.

> Brand, reviews and questions: one model's view (Claude Opus 5.5), from its own knowledge, not ChatGPT, Gemini or Perplexity. The web Brandscope and Reviewscope ask three assistants.

Main phrase: “Семантичне розбиття наочно” (read off the h1).

## Status

| Question | State | Problems |
|---|---|---|
| Shown well in search? | Problems | 7 |
| AI finds it? | OK | 0 |
| AI reads all of it? | Problems | 2 |
| AI quotes it right? | Problems | 10 |
| AI gets the brand right? | Problems | 1 |
| Languages in order? | OK | 1 |

## Biggest problems

1. **Medium** · 2 broken links · `div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card, div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card`
2. **Medium** · Required schema fields missing · `JSON-LD #2 $`
3. **Medium** · 2 passages start mid-sentence · `passages #6, #14`
4. **Medium** · No answer: “Можна вставити посилання на PDF заміс…” · `question 11 · no passage` · *Agent's judgement · Claude Opus 5.5*
5. **Medium** · No answer: “Потрібна сторінка відкривається лише …” · `question 12 · no passage` · *Agent's judgement · Claude Opus 5.5*

## All problems

| # | Severity | Problem | Where | Layer | Code |
|---|---|---|---|---|---|
| 1 | Medium | 2 broken links | `div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card, div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card` | Measured | `broken_links` |
| 2 | Medium | Required schema fields missing | `JSON-LD #2 $` | Measured | `schema_required_missing` |
| 3 | Medium | 2 passages start mid-sentence | `passages #6, #14` | Derived | `mid_sentence_start` |
| 4 | Medium | No answer: “Можна вставити посилання на PDF заміс…” | `question 11 · no passage` | Agent's judgement · Claude Opus 5.5 | `question_missing` |
| 5 | Medium | No answer: “Потрібна сторінка відкривається лише …” | `question 12 · no passage` | Agent's judgement · Claude Opus 5.5 | `question_missing` |
| 6 | Medium | Main phrase in 2 of 15 sections | `2 of 15 h2 sections` | Derived | `keyword_one_section` |
| 7 | Medium | Menu lines inside the text | `passage #1` | Measured | `nav_in_content` |
| 8 | Medium | AI doesn't know the brand | `brand questions 1–5` | Agent's judgement · Claude Opus 5.5 | `brand_unknown` |
| 9 | Low | Answered in part: “Чи можна перевірити сторінку з телефо…” | `question 4 · passage #1` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 10 | Low | 1 very short section | `h2 “Важливий фрагмент за лімітом?”` | Measured | `thin_section` |
| 11 | Low | Answered in part: “Завтра запускаємо сторінку: чи асисте…” | `question 1 · passage #5` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 12 | Low | Answered in part: “Наш сайт — застосунок на React. Текст…” | `question 9 · passage #5` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 13 | Low | Answered in part: “До п’ятниці треба перевірити двадцять…” | `question 10 · passage #14` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 14 | Low | 4 sentences of one shape | `passage #13 · word 1670, passage #13 · word 1674, passage #13 · word 1752` | Measured | `repeated_sentence_shape` |
| 15 | Low | FAQ rich result retired | `FAQPage` | Measured | `faq_rich_result_retired` |
| 16 | Low | How-to: no rich result any more | `HowTo` | Measured | `rich_result_retired` |
| 17 | Low | 151 KB, 42 scripts | `HTML` | Derived | `page_weight_heavy` |
| 18 | Low | llms.txt: one language only | `/llms.txt` | Measured | `llms_txt_one_language` |
| 19 | Low | 3 security headers missing | `Content-Security-Policy, X-Content-Type-Options, frame-ancestors` | Measured | `security_headers_missing` |
| 20 | Low | No contact link | `contact link` | Measured | `about_contact_missing` |
| 21 | Low | 92% of the text off the phrase | `15 passages without the phrase` | Derived | `off_keyword_share` |

## Page map

Top to bottom; the numbers are the problems above. Unseen: the text reaches no passage an AI retriever would read.

1. Site header · navigation
2. Hero · problems 6, 7, 9
3. Sidebar · unseen
4. Що це означає?
5. Важливий фрагмент за лімітом? · problems 10
6. Моделі й ліміти пошуку різняться.
7. Як читати свій результат · problems 3, 11, 12
8. Що таке семантичне розбиття на фрагменти?
9. Чи готовий мій контент до пошуку з ШІ?
10. Як перевірити RAG-конвеєр за допомогою Vectorscope
11. Для кого Vectorscope?
12. Слова, вжиті на цій сторінці
13. 4 more sections · problems 1, 3, 13, 14
14. Footer

**`<head>`**

- title: 42 characters
- meta description: 145 characters
- canonical: /uk/vectorscope
- meta robots: index, follow · index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1
- hreflang: en · uk · es · x-default
- html lang: uk
- JSON-LD: Organization, WebSite +6 · problems 2, 15, 16
- Open Graph: 4 of 4 tags
- viewport: set
- scripts: 42 · 1 blocking · problems 17
- favicon: loads

**`robots.txt` · `llms.txt`**

- Google · Bing: allowed
- AI search bots: allowed
- AI training bots: allowed
- sitemap.xml: lists the page
- llms.txt: present · 32 links · problems 18
- Markdown copy: none
- ai-catalog.json: none

## Google and Bing checks

| Check | State |
|---|---|
| HTTP status and redirects | Passed |
| Served over HTTPS | Passed |
| Googlebot and Bingbot may fetch the page | Passed |
| Not marked noindex | Passed |
| One absolute canonical to the page itself | Passed |
| Listed in the sitemap | Passed |
| In Google's index | Not measured |
| Title present, 10–60 characters | Passed |
| A different title per language version | Passed |
| Description present, 70–160 characters | Passed |
| Open Graph and Twitter card tags | Passed |
| One h1 | Passed |
| No skipped heading levels | Passed |
| Images carry alt | Not on this page |
| html lang declared | Passed |
| A readable URL | Passed |
| Internal links present | Passed |
| Links say where they lead, #links have a target, no nofollow inside the site | Passed |
| Links answer without errors | Problem |
| A mobile viewport | Passed |
| HTML size and scripts | Warning |
| Core Web Vitals from real users | Not measured |
| hreflang versions link back | Passed |
| FAQPage markup | Warning |
| BreadcrumbList markup | Passed |
| Image sizes, formats, lazy loading, srcset | Not on this page |
| Eligible for a snippet (no nosnippet, max-snippet:0) | Passed |
| A favicon that loads | Passed |
| WebSite name markup on the home page | Not on this page |
| No http:// resources on https | Passed |
| A missing page answers 404 | Passed |
| http, www and slash variants end at the page | Passed |
| Strict-Transport-Security header | Passed |
| Compression, Cache-Control and security headers | Warning |
| Author, About, Contact, organisation, dates, privacy and terms | Warning |

## Bots in robots.txt (path `/uk/vectorscope`)

| Bot | Vendor | Purpose | Verdict | Rule |
|---|---|---|---|---|
| OAI-SearchBot | OpenAI | search | allowed | `Allow: /uk` |
| ChatGPT-User | OpenAI | a user's question | allowed | `Allow: /uk` |
| GPTBot | OpenAI | training | allowed | `Allow: /uk` |
| Claude-SearchBot | Anthropic | search | allowed | `Allow: /uk` |
| Claude-User | Anthropic | a user's question | allowed | `Allow: /uk` |
| ClaudeBot | Anthropic | training | allowed | `Allow: /uk` |
| PerplexityBot | Perplexity | search | allowed | `Allow: /uk` |
| Perplexity-User | Perplexity | a user's question | allowed | `Allow: /uk` |
| Google-Extended | Google | training | allowed | `Allow: /uk` |
| Googlebot | Google | web index | allowed | `Allow: /uk` |
| Bingbot | Microsoft | web index | allowed | `Allow: /uk` |
| CCBot | Common Crawl | training | allowed | `Allow: /uk` |

## Language versions

x-default: yes

| Lang | Title | Description | hreflang | Same facts |
|---|---|---|---|---|
| uk (this page) | Passed | Passed | Passed | Passed |
| en | Passed | Passed | Passed | Passed |
| es | Passed | Passed | Passed | Passed |

## Where the text goes (characters)

| Stage | Characters |
|---|---|
| Raw HTML | 48,668 |
| Removed | 34,702 |
| Kept | 13,966 |
| In passages | 13,564 |
| Not in passages | 402 |
| Past the cap | 0 |

17 of 26 passages.

## Not checked

- The promise-without-a-figure rule reads English only
- 4 sections drawn as one zone on the map

## How generated the text sounds `derived` `judgement`

Stock phrasing, marker words and generic passages. Not an authorship detector: who wrote the text cannot be shown from the text.

- **Pattern score** `derived`: 2/100, low (12 points over 2,022 words = 5.93 per 1,000; PatternScope det-1/score-1, language uk).
- **Marker words** `derived`: 0 per 1,000 words, rare (0 occurrences; not part of the score; thresholds not yet calibrated).
- **Generic passages** `judgement`: 4 of 17, 13% of passage characters (the agent's swap test).
- **Too short for a score** `measured`: 6 of 17 passages under 60 words (#0, #2, #3, #4, #14, #16).

The script and the agent disagree on #10 and #12: #10 low score, generic text; #12 low score, generic text. Shown, not averaged.

### Where the score comes from `derived`

- Repeated sentence shape: 4 findings, 12 points — “Це інструмент візуалізації ембедингів?”, “Так, для однієї сторінки за раз.”, “Не для того, щоб різати сторінку.”, “Це не детектор ШІ.”

| # | Heading | Score | Markers /1k | Agent | Evidence |
|---|---|---|---|---|---|
| #0 | Семантичне розбиття сторінки — Vectorscope | — (37 words) | 0 | specific | “що не вміщується в ліміт 26” — Називає власний ліміт інструмента — 26 уривків. |
| #1 | — | 0 low | 0 | specific | “розріз по h2, далі вікна по 2000 символів до 26 фрагментів / сторінку” — Точні параметри розрізу: h2, вікна по 2000 символів, ліміт 26. |
| #2 | Що це означає? | — (39 words) | 0 | generic | “Це попередній погляд машини, а не гарантія того, що з ним зробить будь-який асистент.” — Загальне пояснення, яке підійде будь-якому візуалізатору розбиття. |
| #3 | Важливий фрагмент за лімітом? | — (23 words) | 0 | specific | “Це прочитання бере зі сторінки не більше 26 фрагментів.” — Конкретна межа і конкретна дія для фрагмента за нею. |
| #4 | Моделі й ліміти пошуку різняться. | — (33 words) | 0 | generic | “Це не доводить, що будь-який асистент проіндексував сторінку.” — Типове застереження, яке конкурент перенесе без змін. |
| #5 | Як читати свій результат | 0 low | 0 | specific | “Vectorscope застосовує ту саму межу, що й продукт, і називає фрагменти, які за неї вийшли.” — Описує власну поведінку інструмента й причини низького видобутку. |
| #6 | Як читати свій результат | 0 low | 0 | specific | “змініть заголовок, прогоніть сторінку знову, задайте те саме питання” — Конкретна процедура перевірки переписаного заголовка. |
| #7 | Що таке семантичне розбиття на фрагменти? | 0 low | 0 | specific | “вікно у 2000 символів із перекриттям у 200, яке закінчується на межі речення” — Точні розміри вікна й перекриття, h3 не ріже фрагмент. |
| #8 | Чи готовий мій контент до пошуку з ШІ? | 0 low | 0 | specific | “директива noindex повідомляється, а не ігнорується” — Чіткий перелік того, що інструмент бачить і чого не бачить. |
| #9 | Як перевірити RAG-конвеєр за допомогою Vectorscope | 0 low | 0 | specific | “можна навести на будь-який URL секунд за двадцять” — Час на URL і покрокова перевірка власного чанкера. |
| #10 | Для кого Vectorscope? | 0 low | 0 | generic ≠ script | “Vectorscope — для всіх, чию сторінку читатимуть фрагментами” — Список аудиторій, який підійде будь-якому подібному інструменту. |
| #11 | Слова, вжиті на цій сторінці | 0 low | 0 | specific | “На цій сторінці крок за змістом — це групування вже вирізаних фрагментів, а не сам розріз.” — Визначення прив’язані до того, як працює саме цей інструмент. |
| #12 | Читати далі | 0 low | 0 | generic ≠ script | “Довші відповіді на питання, які ця сторінка може лише підсумувати.” — Звичайний список посилань без власного змісту. |
| #13 | Питання, які про це ставлять | 8 low | 0 | specific | “Vectorscope ріже по кожному h2 — h3 нового фрагмента не починає” — Відповіді називають власні правила розрізу й зберігання. |
| #14 | Питання, які про це ставлять | — (32 words) | 0 | specific | “Обмеження існує, бо кожне читання витрачає виклик ембедингів” — Пояснює, звідки береться обмеження частоти саме тут. |
| #15 | Інші безкоштовні AI SEO інструменти | 0 low | 0 | specific | “спершу не називаючи платформи, потім називаючи всі дванадцять” — Названі власні інструменти з конкретними деталями. |
| #16 | Чого це показати не може | — (45 words) | 0 | specific | “для цього потрібен корпус усього сайту, зміряний у часі” — Чітка межа однієї сторінки проти корпусу продукту. |


## What this check cannot see

- Descriptions of each problem and directions to fix it: [Full version from GetLoopLoop](https://www.getlooploop.com)
- What real assistants (ChatGPT, Gemini, Perplexity) say about your brand and reviews: [Brandscope](https://www.getlooploop.com/brandscope) · [Reviewscope](https://www.getlooploop.com/reviewscope)
- How their answers change from day to day: [AI answer volatility](https://www.getlooploop.com/ai-volatility)
- How AI groups your text by meaning (embeddings): [Vectorscope](https://www.getlooploop.com/vectorscope)
- Search Console data, real-user speed, sites over 50 pages, tracking over time: [GetLoopLoop](https://www.getlooploop.com)

Full report with explanations: https://www.getlooploop.com
