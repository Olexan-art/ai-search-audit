# AI Search Audit Lite: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching

HTTP caching - HTTP \| MDN · checked 18 Oct 2026 · skill 2.109

**Nothing hides text from AI** · 10 problems (blocking 0, high 0, medium 3, low 7)

Lite lists problems, not fixes: labels, severities and places. The checks are deterministic (measured or derived); the questions, the brand and the reviews are the agent's judgement, marked as such.

Main phrase: “HTTP caching” (read off the h1).

## Status

| Question | State | Problems |
|---|---|---|
| Shown well in search? | OK | 4 |
| AI finds it? | OK | 1 |
| AI reads all of it? | Problems | 1 |
| AI quotes it right? | Problems | 4 |
| AI gets the brand right? | Not checked | 0 |
| Languages in order? | One version | 0 |

## Biggest problems

1. **Medium** · 9 passages start mid-sentence · `passages #3, #10, #11, #12, #14, #16`
2. **Medium** · Main phrase in 4 of 15 sections · `4 of 15 h2 sections`
3. **Medium** · Menu lines inside the text · `passage #8`
4. **Low** · No llms.txt · `/llms.txt`
5. **Low** · Preview tags missing · `og:title, og:description, og:image`

## All problems

| # | Severity | Problem | Where | Layer | Code |
|---|---|---|---|---|---|
| 1 | Medium | 9 passages start mid-sentence | `passages #3, #10, #11, #12, #14, #16` | Derived | `mid_sentence_start` |
| 2 | Medium | Main phrase in 4 of 15 sections | `4 of 15 h2 sections` | Derived | `keyword_one_section` |
| 3 | Medium | Menu lines inside the text | `passage #8` | Measured | `nav_in_content` |
| 4 | Low | No llms.txt | `/llms.txt` | Measured | `llms_txt_missing` |
| 5 | Low | Preview tags missing | `og:title, og:description, og:image` | Measured | `social_tags_missing` |
| 6 | Low | 2 images without width and height | `div.layout__body.reference-layout__body > section.content-section > p > img, div.layout__body.reference-layout__body > section.content-section > p > img` | Measured | `image_dimensions_missing` |
| 7 | Low | 2 sentences of one shape | `passage #5 · word 899, passage #18 · word 3890` | Measured | `repeated_sentence_shape` |
| 8 | Low | No Organization markup | `no Organization markup` | Measured | `organization_details_missing` |
| 9 | Low | No contact link | `contact link` | Measured | `about_contact_missing` |
| 10 | Low | 78% of the text off the phrase | `20 passages without the phrase` | Derived | `off_keyword_share` |

## Page map

Top to bottom; the numbers are the problems above. Unseen: the text reaches no passage an AI retriever would read.

1. Site header · navigation
2. Hero · problems 2
3. In this article
4. Types of caches · problems 1, 2, 6
5. Heuristic caching · problems 7
6. Fresh and stale based on age
7. Expires or max-age
8. Vary · problems 3
9. Validation · problems 1
10. Don't cache · problems 1
11. Reload and force reload · problems 1
12. Deleting stored responses
13. 5 more sections · problems 1, 2, 6, 7
14. Footer

**`<head>`**

- title: 25 characters
- meta description: 114 characters
- canonical: /en-US/docs/Web/HTTP/Guides/Caching
- meta robots: not set
- hreflang: none
- html lang: en-US
- JSON-LD: BreadcrumbList, ListItem · problems 8
- Open Graph: 1 of 4 tags · problems 5
- viewport: set
- scripts: 6 · 0 blocking
- favicon: loads

**`robots.txt` · `llms.txt`**

- Google · Bing: allowed
- AI search bots: allowed
- AI training bots: allowed
- sitemap.xml: lists the page
- llms.txt: none · problems 4
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
| A different title per language version | Not on this page |
| Description present, 70–160 characters | Passed |
| Open Graph and Twitter card tags | Warning |
| One h1 | Passed |
| No skipped heading levels | Passed |
| Images carry alt | Passed |
| html lang declared | Passed |
| A readable URL | Passed |
| Internal links present | Passed |
| Links say where they lead, #links have a target, no nofollow inside the site | Passed |
| Links answer without errors | Passed |
| A mobile viewport | Passed |
| HTML size and scripts | Passed |
| Core Web Vitals from real users | Not measured |
| hreflang versions link back | Not on this page |
| FAQPage markup | Not on this page |
| BreadcrumbList markup | Not on this page |
| Image sizes, formats, lazy loading, srcset | Warning |
| Eligible for a snippet (no nosnippet, max-snippet:0) | Passed |
| A favicon that loads | Passed |
| WebSite name markup on the home page | Not on this page |
| No http:// resources on https | Passed |
| A missing page answers 404 | Passed |
| http, www and slash variants end at the page | Passed |
| Strict-Transport-Security header | Passed |
| Compression, Cache-Control and security headers | Passed |
| Author, About, Contact, organisation, dates, privacy and terms | Warning |

## Bots in robots.txt (path `/en-US/docs/Web/HTTP/Guides/Caching`)

| Bot | Vendor | Purpose | Verdict | Rule |
|---|---|---|---|---|
| OAI-SearchBot | OpenAI | search | allowed | — |
| ChatGPT-User | OpenAI | a user's question | allowed | — |
| GPTBot | OpenAI | training | allowed | — |
| Claude-SearchBot | Anthropic | search | allowed | — |
| Claude-User | Anthropic | a user's question | allowed | — |
| ClaudeBot | Anthropic | training | allowed | — |
| PerplexityBot | Perplexity | search | allowed | — |
| Perplexity-User | Perplexity | a user's question | allowed | — |
| Google-Extended | Google | training | allowed | — |
| Googlebot | Google | web index | allowed | — |
| Bingbot | Microsoft | web index | allowed | — |
| CCBot | Common Crawl | training | allowed | — |

## Language versions

One language version: the page declares no hreflang.

## Where the text goes (characters)

| Stage | Characters |
|---|---|
| Raw HTML | 93,570 |
| Removed | 60,964 |
| Kept | 32,606 |
| In passages | 32,366 |
| Not in passages | 240 |
| Past the cap | 0 |

26 of 26 passages.

## Not checked

- questions.json not given: that judgement was not made
- brand.json not given: that judgement was not made
- reviews.json not given: that judgement was not made
- 470 links not checked (cap 30)
- 5 sections drawn as one zone on the map

## How generated the text sounds `derived` `judgement`

Stock phrasing, marker words and generic passages. Not an authorship detector: who wrote the text cannot be shown from the text.

- **Pattern score** `derived`: 0/100, low (6 points over 5,255 words = 1.14 per 1,000; PatternScope det-1/score-1, language en).
- **Marker words** `derived`: 0.2 per 1,000 words, rare (1 occurrences; not part of the score; thresholds not yet calibrated).
- **Generic passages** `judgement`: 5 of 26, 6% of passage characters (the agent's swap test).
- **Too short for a score** `measured`: 3 of 26 passages under 60 words (#0, #24, #25).

The script and the agent disagree on #1 and #23: #1 low score, generic text; #23 low score, generic text. Shown, not averaged.

### Where the score comes from `derived`

- Repeated sentence shape: 2 findings, 6 points — “This is called heuristic caching.”, “This is called request collapse.”

Marker words (not in the score): ecosystem.

| # | Heading | Score | Markers /1k | Agent | Evidence |
|---|---|---|---|---|---|
| #0 | HTTP caching - HTTP \| MDN | — (24 words) | 0 | generic | “The HTTP cache stores a response associated with a request and reuses the stored response for subsequent requests.” — Title plus a one-line definition any caching page would open with. |
| #1 | — | 0 low | 0 | generic ≠ script | “Proper operation of the cache is critical to the health of the system.” — General benefits of caching (speed, less server load) with no header, number or example. |
| #2 | Types of caches | 0 low | 0 | specific | “Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate” — Private vs shared caches with exact directives, including the kitchen-sink header. |
| #3 | Types of caches | 0 low | 0 | specific | “some browsers only allow certificates issued with an SCT (signed certificate timestamp), this method requires the application of an enterprise policy” — Concrete account of TLS bridge proxies, CT and managed caches. |
| #4 | Types of caches | 0 low | 0 | specific | “some CDNs provide their own headers that are effective only for that CDN (for example, Surrogate-Control)” — Names Varnish VCL, Surrogate-Control and CDN-Cache-Control. |
| #5 | Heuristic caching | 0 low | 0 | specific | “the specification recommends about 10% (in this case 0.1 year) of the time after storing” — Heuristic caching with a worked example and the 10% rule. |
| #6 | Fresh and stale based on age | 0 low | 0 | specific | “fresh for the remaining 518400 seconds, the difference between the response's max-age and Age” — Worked max-age/Age arithmetic a reader can check. |
| #7 | Expires or max-age | 0 low | 0 | specific | “If both Expires and Cache-Control: max-age are available, max-age is defined to be preferred.” — Exact precedence rule between two headers. |
| #8 | Vary | 0 low | 0 | specific | “Vary: Accept-Language” — Shows how Vary changes the cache key, with tables and the User-Agent caveat. |
| #9 | Validation | 0 low | 0 | specific | “The server will respond with 304 Not Modified if the content has not changed since the specified time.” — If-Modified-Since request/response exchange with exact timestamps. |
| #10 | Validation | 0 low | 0 | specific | “if both If-Modified-Since and If-None-Match are present, then If-None-Match takes precedence for the validator” — ETag/If-None-Match exchange, RFC9110 note and precedence rule. |
| #11 | Validation | 0 low | 3 | specific | “The no-cache directive (or equivalent, such as max-age=0, must-revalidate) does not guarantee revalidation for history navigations” — Forced revalidation with no-cache and the bfcache exception. |
| #12 | Validation | 0 low | 0 | specific | “there's no reason to ever use that max-age=0 and must-revalidate combination — you should instead just use no-cache” — Explains a historical workaround and gives a definite recommendation. |
| #13 | Don't cache | 0 low | 0 | specific | “returning no-store will not prevent the old response from being reused” — Distinguishes no-cache, no-store and private by exact behaviour. |
| #14 | Don't cache | 0 low | 0 | specific | “Cache-Control: no-cache, private” — Concrete replacement for kitchen-sink headers and what no-store costs (bfcache). |
| #15 | Reload and force reload | 0 low | 0 | specific | “fetch("/", { cache: "no-cache" });” — Actual reload request headers and the matching Fetch cache mode. |
| #16 | Reload and force reload | 0 low | 0 | specific | “Cache-Control: max-age=31536000, immutable” — Force-reload fetch mode, the immutable directive and Chrome's behaviour. |
| #17 | Deleting stored responses | 0 low | 0 | specific | “The Clear-Site-Data: cache header and directive value can be used to clear browser caches — but has no effect on intermediate caches.” — Names a header and the exact limit of what it clears. |
| #18 | Request collapse | 0 low | 0 | specific | “Request collapse occurs when requests are arriving at the same time, so even if max-age=0 or no-cache is given in the response, it will be reused.” — Defines request collapse and a checkable directive interaction. |
| #19 | Common caching patterns | 0 low | 0 | specific | “# version in filename bundle.v123.js # version in query bundle.js?v=123” — Default Cache-Control pattern and concrete cache-busting URLs. |
| #20 | Common caching patterns | 0 low | 0 | specific | “41 cache-control public, max-age=31536000” — QPACK static table entries and what public does with Authorization. |
| #21 | Common caching patterns | 0 low | 0 | specific | “Cache-Control: public, max-age=31536000, immutable” — Full response headers for a cache-busted bundle. |
| #22 | Common caching patterns | 0 low | 0 | specific | “The same can be used for favicon.ico, manifest.json, .well-known, and API endpoints whose URLs cannot be changed using cache busting.” — Concrete header set for main resources, personalized and not. |
| #23 | Common caching patterns | 0 low | 0 | generic ≠ script | “For more information, see the documentation for your CDN, and consult the service worker documentation.” — General advice to purge via a CDN or service worker; no header, value or procedure. |
| #24 | See also | — (16 words) | 0 | generic | “RFC 9111: Hypertext Transfer Protocol (HTTP/1.1): Caching” — A See also link list; any caching page could carry the same references. |
| #25 | Help improve MDN | — (27 words) | 0 | generic | “Learn how to contribute” — Site footer boilerplate with nothing about the subject. |


## What this check cannot see

- Descriptions of each problem and directions to fix it: [Full version from GetLoopLoop](https://www.getlooploop.com)
- What real assistants (ChatGPT, Gemini, Perplexity) say about your brand and reviews: [Brandscope](https://www.getlooploop.com/brandscope) · [Reviewscope](https://www.getlooploop.com/reviewscope)
- How their answers change from day to day: [AI answer volatility](https://www.getlooploop.com/ai-volatility)
- How AI groups your text by meaning (embeddings): [Vectorscope](https://www.getlooploop.com/vectorscope)
- Search Console data, real-user speed, sites over 50 pages, tracking over time: [GetLoopLoop](https://www.getlooploop.com)

Full report with explanations: https://www.getlooploop.com
