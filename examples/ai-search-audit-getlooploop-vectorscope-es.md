# AI Search Audit Lite: https://www.getlooploop.com/es/vectorscope

Fragmentado semántico de tu página — Vectorscope · checked 17 Oct 2026 · skill 2.109

**Nothing hides text from AI** · 18 problems (blocking 0, high 0, medium 7, low 11)

Lite lists problems, not fixes: labels, severities and places. The checks are deterministic (measured or derived); the questions, the brand and the reviews are the agent's judgement, marked as such.

> Brand, reviews and questions: one model's view (Claude Opus 5.5), from its own knowledge, not ChatGPT, Gemini or Perplexity. The web Brandscope and Reviewscope ask three assistants.

Main phrase: “El fragmentado semántico” (read off the h1).

## Status

| Question | State | Problems |
|---|---|---|
| Shown well in search? | Problems | 7 |
| AI finds it? | OK | 0 |
| AI reads all of it? | Problems | 2 |
| AI quotes it right? | Problems | 7 |
| AI gets the brand right? | Problems | 1 |
| Languages in order? | OK | 1 |

## Biggest problems

1. **Medium** · 2 broken links · `div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card, div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card`
2. **Medium** · Required schema fields missing · `JSON-LD #2 $`
3. **Medium** · 3 passages start mid-sentence · `passages #6, #8, #15`
4. **Medium** · No answer: “¿Puedo pegar el enlace de un PDF en l…” · `question 11 · no passage` · *Agent's judgement · Claude Opus 5.5*
5. **Medium** · No answer: “La página que necesito solo se abre t…” · `question 12 · no passage` · *Agent's judgement · Claude Opus 5.5*

## All problems

| # | Severity | Problem | Where | Layer | Code |
|---|---|---|---|---|---|
| 1 | Medium | 2 broken links | `div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card, div.mt-12.space-y-14 > section#more > div.mt-7.grid > a.group.pt-card` | Measured | `broken_links` |
| 2 | Medium | Required schema fields missing | `JSON-LD #2 $` | Measured | `schema_required_missing` |
| 3 | Medium | 3 passages start mid-sentence | `passages #6, #8, #15` | Derived | `mid_sentence_start` |
| 4 | Medium | No answer: “¿Puedo pegar el enlace de un PDF en l…” | `question 11 · no passage` | Agent's judgement · Claude Opus 5.5 | `question_missing` |
| 5 | Medium | No answer: “La página que necesito solo se abre t…” | `question 12 · no passage` | Agent's judgement · Claude Opus 5.5 | `question_missing` |
| 6 | Medium | Menu lines inside the text | `passage #1` | Measured | `nav_in_content` |
| 7 | Medium | AI doesn't know the brand | `brand questions 1–5` | Agent's judgement · Claude Opus 5.5 | `brand_unknown` |
| 8 | Low | Answered in part: “¿Puedo revisar una página desde el mó…” | `question 4 · passage #1` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 9 | Low | 1 very short section | `h2 “¿Un pasaje importante fuera del límite?”` | Measured | `thin_section` |
| 10 | Low | Answered in part: “Mañana publicamos la página: ¿un asis…” | `question 1 · passage #5` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 11 | Low | Answered in part: “Nuestra web es una app de React. ¿Se …” | `question 9 · passage #5` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 12 | Low | Answered in part: “Tengo veinte páginas que revisar ante…” | `question 10 · passage #15` | Agent's judgement · Claude Opus 5.5 | `question_partial` |
| 13 | Low | FAQ rich result retired | `FAQPage` | Measured | `faq_rich_result_retired` |
| 14 | Low | How-to: no rich result any more | `HowTo` | Measured | `rich_result_retired` |
| 15 | Low | 134 KB, 42 scripts | `HTML` | Derived | `page_weight_heavy` |
| 16 | Low | llms.txt: one language only | `/llms.txt` | Measured | `llms_txt_one_language` |
| 17 | Low | 3 security headers missing | `Content-Security-Policy, X-Content-Type-Options, frame-ancestors` | Measured | `security_headers_missing` |
| 18 | Low | No contact link | `contact link` | Measured | `about_contact_missing` |

## Page map

Top to bottom; the numbers are the problems above. Unseen: the text reaches no passage an AI retriever would read.

1. Site header · navigation
2. Hero · problems 6, 8
3. Sidebar · unseen
4. ¿Qué significa esto?
5. ¿Un pasaje importante fuera del límite? · problems 9
6. Los modelos y los límites varían.
7. Cómo leer tu resultado · problems 3, 10, 11
8. ¿Qué es el fragmentado semántico? · problems 3
9. ¿Está mi contenido listo para la búsqueda con IA?
10. Usar Vectorscope para probar un pipeline RAG
11. ¿Para quién es Vectorscope?
12. Palabras usadas en esta página
13. 4 more sections · problems 1, 3, 12
14. Footer

**`<head>`**

- title: 48 characters
- meta description: 146 characters
- canonical: /es/vectorscope
- meta robots: index, follow · index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1
- hreflang: en · uk · es · x-default
- html lang: es
- JSON-LD: Organization, WebSite +6 · problems 2, 13, 14
- Open Graph: 4 of 4 tags
- viewport: set
- scripts: 42 · 1 blocking · problems 15
- favicon: loads

**`robots.txt` · `llms.txt`**

- Google · Bing: allowed
- AI search bots: allowed
- AI training bots: allowed
- sitemap.xml: lists the page
- llms.txt: present · 32 links · problems 16
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

## Bots in robots.txt (path `/es/vectorscope`)

| Bot | Vendor | Purpose | Verdict | Rule |
|---|---|---|---|---|
| OAI-SearchBot | OpenAI | search | allowed | `Allow: /es` |
| ChatGPT-User | OpenAI | a user's question | allowed | `Allow: /es` |
| GPTBot | OpenAI | training | allowed | `Allow: /es` |
| Claude-SearchBot | Anthropic | search | allowed | `Allow: /es` |
| Claude-User | Anthropic | a user's question | allowed | `Allow: /es` |
| ClaudeBot | Anthropic | training | allowed | `Allow: /es` |
| PerplexityBot | Perplexity | search | allowed | `Allow: /es` |
| Perplexity-User | Perplexity | a user's question | allowed | `Allow: /es` |
| Google-Extended | Google | training | allowed | `Allow: /es` |
| Googlebot | Google | web index | allowed | `Allow: /es` |
| Bingbot | Microsoft | web index | allowed | `Allow: /es` |
| CCBot | Common Crawl | training | allowed | `Allow: /es` |

## Language versions

x-default: yes

| Lang | Title | Description | hreflang | Same facts |
|---|---|---|---|---|
| es (this page) | Passed | Passed | Passed | Passed |
| en | Passed | Passed | Passed | Passed |
| uk | Passed | Passed | Passed | Passed |

## Where the text goes (characters)

| Stage | Characters |
|---|---|
| Raw HTML | 50,441 |
| Removed | 35,410 |
| Kept | 15,031 |
| In passages | 14,590 |
| Not in passages | 441 |
| Past the cap | 0 |

18 of 26 passages.

## Not checked

- The promise-without-a-figure rule reads English only
- 4 sections drawn as one zone on the map

## How generated the text sounds `derived` `judgement`

Stock phrasing, marker words and generic passages. Not an authorship detector: who wrote the text cannot be shown from the text.

- **Pattern score** `derived`: 0/100, low (0 points over 2,489 words = 0 per 1,000; PatternScope det-1/score-1, language es).
- **Marker words** `derived`: 0 per 1,000 words, rare (0 occurrences; not part of the score; thresholds not yet calibrated).
- **Generic passages** `judgement`: 5 of 18, 15% of passage characters (the agent's swap test).
- **Too short for a score** `measured`: 6 of 18 passages under 60 words (#0, #2, #3, #4, #8, #17).

The script and the agent disagree on #11 and #13: #11 low score, generic text; #13 low score, generic text. Shown, not averaged.

| # | Heading | Score | Markers /1k | Agent | Evidence |
|---|---|---|---|---|---|
| #0 | Fragmentado semántico de tu página — Vectorscope | — (47 words) | 0 | generic | “mira qué sobrevive el viaje al espacio vectorial” — A tagline and a paste-a-URL promise any chunking viewer could open with; no number, limit or method. |
| #1 | — | 0 low | 0 | specific | “corte en h2, luego ventanas de 2000 caracteres máx. 26 fragmentos / página” — States this tool's exact split rule and its 26-passage cap. |
| #2 | ¿Qué significa esto? | — (51 words) | 0 | generic | “Es una vista previa de lo que ve la máquina, no una garantía de lo que hará con ella un asistente.” — A preview-not-a-guarantee explainer that any chunking visualiser could carry. |
| #3 | ¿Un pasaje importante fuera del límite? | — (26 words) | 0 | specific | “Esta lectura toma como máximo 26 pasajes de una página.” — Names the 26-passage cap and the fix for a passage past it. |
| #4 | Los modelos y los límites varían. | — (40 words) | 0 | generic | “Esto no demuestra que ningún asistente haya indexado la página.” — A standard disclaimer that fits any retrieval preview tool. |
| #5 | Cómo leer tu resultado | 0 low | 0 | specific | “Vectorscope aplica el mismo límite que el producto y nombra los fragmentos que se quedaron fuera.” — Ties the cap to the product's own pipeline and ranks extraction failure causes. |
| #6 | Cómo leer tu resultado | 0 low | 0 | specific | “cambia el titular, vuelve a pasar la página, haz la misma pregunta.” — A concrete procedure for testing a rewritten heading with the tool. |
| #7 | ¿Qué es el fragmentado semántico? | 0 low | 0 | specific | “una ventana de 2000 caracteres con 200 de solapamiento, que termina en un final de frase si hay uno lo bastante cerca” — Exact window size, overlap and sentence-end rule; h3 stays inside its h2. |
| #8 | ¿Qué es el fragmentado semántico? | — (58 words) | 0 | specific | “Un grupo que cruza tres secciones h2 dice que los titulares partieron una idea” — Explains how to read this tool's clusters against its own h2 cuts. |
| #9 | ¿Está mi contenido listo para la búsqueda con IA? | 0 low | 0 | specific | “una directiva noindex se informa, no se ignora.” — Lists exactly what this tool reports and what it cannot see, including noindex handling. |
| #10 | Usar Vectorscope para probar un pipeline RAG | 0 low | 0 | specific | “puedes apuntar a cualquier URL en unos veinte segundos” — Timing, a four-step test procedure and the production chunker parameters. |
| #11 | ¿Para quién es Vectorscope? | 0 low | 0 | generic ≠ script | “Vectorscope es para cualquiera cuya página se lea por pasajes” — An audience list that would fit any chunking tool with the name swapped. |
| #12 | Palabras usadas en esta página | 0 low | 0 | specific | “En esta página el paso basado en el significado es el agrupamiento de pasajes ya cortados, no el corte en sí.” — Definitions anchored to how this tool actually works. |
| #13 | Seguir leyendo | 0 low | 0 | generic ≠ script | “Respuestas más largas a las preguntas que esta página solo puede resumir.” — A link list with one-line teasers; nothing only this page could say. |
| #14 | Preguntas que la gente hace sobre esto | 0 low | 0 | specific | “Vectorscope corta en cada h2 —un h3 no abre un pasaje nuevo— y divide una sección larga en ventanas de 2000 caracteres con 200 de solapamiento.” — FAQ answers carry the tool's exact cut rules and retention behaviour. |
| #15 | Preguntas que la gente hace sobre esto | 0 low | 0 | specific | “El límite existe porque cada lectura gasta una llamada de embeddings” — Gives the reason for the rate limit and how it resets. |
| #16 | Otras herramientas SEO con IA gratis | 0 low | 0 | specific | “primero sin nombrar plataformas y luego nombrando las doce” — Names the sibling tools and what each one concretely does. |
| #17 | Lo que esto no puede enseñarte | — (54 words) | 0 | specific | “eso necesita el corpus del sitio entero, medido en el tiempo.” — States this tool's boundary against the product's site-wide, over-time corpus. |


## What this check cannot see

- Descriptions of each problem and directions to fix it: [Full version from GetLoopLoop](https://www.getlooploop.com)
- What real assistants (ChatGPT, Gemini, Perplexity) say about your brand and reviews: [Brandscope](https://www.getlooploop.com/brandscope) · [Reviewscope](https://www.getlooploop.com/reviewscope)
- How their answers change from day to day: [AI answer volatility](https://www.getlooploop.com/ai-volatility)
- How AI groups your text by meaning (embeddings): [Vectorscope](https://www.getlooploop.com/vectorscope)
- Search Console data, real-user speed, sites over 50 pages, tracking over time: [GetLoopLoop](https://www.getlooploop.com)

Full report with explanations: https://www.getlooploop.com
