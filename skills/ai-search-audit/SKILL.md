---
name: ai-search-audit
description: Audit one public web page for classic search and AI search (SEO and GEO): robots.txt for Googlebot and AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot), noindex and snippets, titles, headings, canonical, structured data, hreflang, how an AI retriever reads the page, and what the agent's own model believes about the brand. Use for an SEO or GEO audit of one page, AI search readiness, why Google, ChatGPT or Perplexity may not show or quote a page, or when ai-search-audit is named. For up to 50 pages, history, rule quotes and fix directions use ai-search-audit-full; for how a retriever cuts a page into passages, Vectorscope.
---

Version 2.109. The first number moves only on a breaking change.

# AI Search Audit (Lite)

This skill checks one public page against the published rules for being crawled, indexed and quoted by Google, Bing and AI assistants, and writes one report. The scripts are deterministic and call no model. You, the agent, add four judgement files from your own reading and knowledge, and the report marks those findings as your judgement, with your model's name. The report lists problems; it does not explain them or say how to fix them.

**Answer the user in the language they wrote in.**

## Before you start

- **`$SKILL` is this skill's folder**, the one this SKILL.md is in. In Claude Code it is `${CLAUDE_SKILL_DIR}`. On claude.ai the whole folder is copied into the code-execution sandbox; use the path you read this file from. Work in a writable directory of your own.
- **No install.** `dist/read.mjs` and `dist/audit.mjs` (with `dist/chunks/`) are bundled with everything they need; plain `node` runs them.
- **Node 20.18 or later.** Check with `node --version`. If there is no Node, or an older one, say so and stop.
- **Network:** the read fetches the page and a capped set of its site's files, links and images, after one DNS lookup and one RDAP request to `rdap.org` that sends the site's IP address and nothing of the page. Nothing is uploaded: no server of ours, no account; the only requests are the ones listed in `references/network-and-limits.md`. Read that file when the user asks what is requested or sent, when the fetch fails, when the shell has no network, or when the skill folder is read-only.
- **Never re-create the audit by hand.** If the scripts cannot run here (no Node, no code execution, the network blocked), say so, say what would make them run, and stop. Do not fetch the page another way and check it yourself, and do not make a saved copy with a browsing or fetch tool: findings made by hand are not the tool's.

## Steps

1. *script* `node "$SKILL/dist/read.mjs" <url> --out reading.json` (add `--render` to compare with a JavaScript render in a local Chrome or Chromium; an empty app shell is rendered without it).
   It prints what it read and every cap it hit. If it prints `REFUSED <code>` (exit code 2), see *Refusals*. Do not retry with another URL unless asked.
2. *judgement* **questions.json** and **style.json.** Read the `text` of every passage in `reading.json` (`vs.passages`), in full. Write 8 to 12 questions a person would say out loud to an assistant about the page's topic, and judge each against the passages. From the same reading, mark every passage specific or generic (the swap test).
3. *judgement* **brand.json.** Name the brand the page belongs to (the site's own name). Answer the five fixed buyer questions **from your own knowledge only**; where you do not know, say so with `"knows": false`.
4. *judgement* **reviews.json.** Step 1 wrote `reviews.template.json` beside `reading.json`. Fill it in as `reviews.json`: for the same brand and from your own knowledge only, the rating you believe it has on each platform it lists, or `"knows": false`.
5. *script* `node "$SKILL/dist/audit.mjs" reading.json --questions questions.json --style style.json --brand brand.json --reviews reviews.json --check`
   It validates the four files against the reading and writes nothing. If it prints `REFUSED <file>: <reason>`, fix that file as the message says and run it again. A `warning` line is advice about the file, not a refusal.
6. *script* `node "$SKILL/dist/audit.mjs" reading.json --questions questions.json --style style.json --brand brand.json --reviews reviews.json --html report.html --md report.md --json export.json` (add `--keyword "phrase"` when the user gave a target keyword; otherwise the keyword is read off the h1).
   It prints the problems, numbered as on the report's map; judgement findings are marked `(judgement)`.
7. **Show the report** (required; see *Show the report*). A chat summary goes with it, never instead of it.

`--html saved.html --final-url <url>` audits a saved copy instead (add `--robots saved-robots.txt` for its robots.txt); then nothing is fetched, and the sitemap, llms.txt, language versions, links, images and site checks are reported as not measured. `--save-html page.html` keeps the fetched copy. Use a saved copy only when the user gives you one.

## The judgement files

**Read `references/judgement-files.md` before writing them**: it has the schemas, an example of each, and the full rules. The essentials:

- **`agent` and `model`** at the top of every file: the product you run in ("Claude Code", "claude.ai", "Codex", "opencode", "Hermes") and your model's name as you know it, up to 60 characters each. Fill them in honestly. If you do not know one, leave it out (the report says "model not stated"). Never guess or invent either.
- **Never in Russian.** Questions and answers are in the page's language (or English for the brand and review answers). What you write is refused if it holds a letter Russian uses that the page's own language does not (on a Ukrainian page, any of the four letters only Russian writes there); quotes are the page's own words and are checked against it instead.
- **questions.json:** 8 to 12 spoken, first-person questions in the page's language, each naming one to three of the axes `urgency`, `device`, `object`, `obstacle` (every axis used at least once; never all four in one question). Most must not contain the page's keyword; no wake words; no question that is another with words added; at least one the page probably does not answer. Judge from the passages only, never from what you know: `passage` (or `null`), `verdict` `complete` / `partial` / `missing`, `citable`, and a `quote` copied verbatim from that passage (up to 400 characters; none for `missing`).
- **style.json:** one verdict for **every** passage: `generic` if it would fit a competitor's page with only the brand name changed, else `specific`; `evidence` verbatim from the passage (up to 200 characters); optional `why`. Judge the passage, not who wrote it: this is not an AI detector.
- **brand.json:** `basis: "own_knowledge"` and the five fixed questions `what_is`, `pricing`, `integrations`, `weaknesses`, `alternatives`, asked of yourself in the reference's wording.
- **reviews.json:** `basis: "own_knowledge"`, the brand's name, and every platform in `reviews.template.json` once, none added or removed, each with `"knows"` set to true (with a `rating` on that platform's scale) or false. Answer each the same way, from what you know of the brand on that platform.

**Honesty rules for brand.json and reviews.json.** Answer from what you already knew: no browsing, no search, no fetch, no other tool, and not from the page you just read. Do not look anything up, even if a tool is available. "I don't know" is a correct answer and the most useful one when it is true: write `"knows": false`. Do not soften a guess into a fact, and do not copy the page into an answer.

## Refusals

| Code | Tell the user |
|---|---|
| `invalid_url` | That does not look like a web address. Ask for the full URL of a page. |
| `blocked_scheme` | Only http and https pages can be read. |
| `blocked_host`, `blocked_address` | That address is not a page on the public web: localhost, a private network, or a non-standard port. |
| `unreachable` | The page could not be reached. It may be down, or the name does not resolve. Then read `references/network-and-limits.md` for what to change in a sandbox, behind a proxy, or with no network. |
| `http_error` | The page answered with an error status (in the reading), or redirected more than 5 times. |
| `blocked` | The site turns automated readers away (HTTP 401, 403 or 429); retrying will not help. |
| `not_html` | The URL is a file such as a PDF or an image, not an HTML page. |
| `too_large` | The page is over the 3 MB ceiling. |
| `empty` | The page answered, but no readable text was left once navigation and boilerplate were removed. |
| `refused_ru_domain` | The address is in a Russian domain zone (.ru, .su, .рф, .москва, .moscow), and this tool does not analyse it; the page was not fetched. |
| `refused_ru_hosting` | The site is hosted in Russia (RDAP gives its server's country as RU), and this tool does not analyse it; the page was not fetched. |
| `refused_ru_audience` | The site has a Russian-language version (an hreflang alternate, og:locale or Content-Language declares one), and this tool does not analyse it. |
| `refused_language_ru` | The page is in Russian, and this tool does not analyse pages in Russian. |

On `refused_ru_domain`, `refused_ru_hosting`, `refused_ru_audience` or `refused_language_ru` the page is not analysed: skip steps 2 to 5, run step 6 without the judgement files (the report holds the reason and its sources), show the report, say in one line in the chat why it was not analysed (the code's line above), and stop. Do not analyse the page in any other way.

## Errors only

The report lists problems: a short label, a severity and the place. It has no descriptions, no "what the rule says" and no fix directions; those belong to the full version, available from GetLoopLoop (https://www.getlooploop.com). **If the user wants fixes, they can ask.** When they do, you may answer from your own knowledge, and say that the advice is yours, not the report's. Do not volunteer a fix list with the summary.

When the user asks what a finding code means, its tile, severity or threshold, or how a check works, read `references/checks.md`.

## Show the report

This step is required. The HTML report is the result; a run that ends with only a chat message has not delivered it. Mentioning the file name is not showing it.

**Present one file: `report.html`.** `report.md` and `export.json` are written beside it for whoever wants the data; keep them there, but do not present, attach, open or preview them. Never open or preview `export.json` or `report.md` as the result, and never end the reply on either of them: the HTML is the report. If the environment shows the last file you present, that last (and only) file must be the HTML.

- **claude.ai or the Claude desktop app, with code execution:** save `report.html` where your environment's own instructions say files for the user go (the outputs folder they name, if they name one), with `report.md` and `export.json` beside it, and present **only `report.html`** as a file in your reply, so the download the user gets and opens is the report. Do not present the JSON or the Markdown, not even after the HTML. A file left in a scratch folder the user cannot see has not been shown. Do not retype the report into an artifact by hand: a copy is not the tool's output.
- **Claude Code:** if the session has a tool for publishing HTML pages or artifacts, publish `report.html` with it, and only that file, and give the link. Otherwise open `report.html` in the user's default browser: `start "" "<absolute path>"` on Windows, `open "<absolute path>"` on macOS, `xdg-open "<absolute path>"` on Linux. Then give its absolute path. Do not open, publish or print the JSON or the Markdown.
- **Codex, opencode, Hermes Agent or any other agent:** give `report.html`'s absolute path and offer to open it in the default browser with the command above (or the agent's own preview or browser tool, if it has one). Preview only the HTML. Name the other two files only if the user asks for the data.

The report is one self-contained file and makes no network requests, so it opens offline. It opens in English and in the light theme; `#lang=uk` opens it in Ukrainian, `#lang=pl` in Polish and `#theme=dark` in the dark theme (for example `report.html#lang=pl&theme=dark`). When the user writes in Ukrainian or Polish, give the link with that `#lang`. When the user asks for the data, or what `report.md`, `export.json` or `reading.json` hold, read `references/outputs.md`.

## The chat summary

Short, alongside the report and never instead of it:

- **If a crawler is blocked (`ai_search_blocked`, `search_engine_blocked`, `robots_unreachable`), snippets are blocked (`snippet_blocked`) or the page is `noindex`, say that first.**
- The verdict line and the counts by severity, as the report states them.
- The biggest problems (the report's numbers 1 to 5), each with where it is.
- What was not checked: every cap the audit printed (links past 30, images past 20, alternates past 10, child sitemaps past 5, sections merged on the map, a render that could not run).
- Say once that the checks are deterministic and rest on a published rule or a threshold this skill names, and that the questions, the brand and the reviews are your own judgement as one model (name it), not what ChatGPT, Gemini or Perplexity say; the web Brandscope and Reviewscope ask three assistants.
- How generated the text sounds, in one line: the Pattern score and its band, the marker words per 1,000 words, and how many passages you judged generic (derived, derived, your judgement). Never say the page was written by AI, or was not: the text cannot show it.
- Do not claim that any assistant has indexed the page, ranks it or will cite it, and do not add a score of your own.
