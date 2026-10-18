---
name: ai-search-audit
description: Audits 1 public web page for search and AI search (SEO and GEO): robots.txt for Googlebot and AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot), noindex, snippets, title, headings, canonical, structured data, hreflang, how an AI retriever reads the page, and what the agent's model knows about the brand. Output: an HTML report. Use for an SEO or GEO audit of 1 page, AI search readiness, or why Google, ChatGPT or Perplexity do not show or quote a page, or when the user names ai-search-audit. For at most 50 pages, history and fix directions, use ai-search-audit-full. For passages only, use vectorscope.
---

Version 2.110. The first number changes only on a breaking change.

# AI Search Audit (Lite)

## Purpose

The skill checks 1 public page against the published rules for crawling, indexing and quoting by Google, Bing and AI assistants, and writes 1 report. You add 4 judgement files; the report marks those findings as your judgement, with your model's name. The report lists problems only, with no explanations and no fixes.

## Requirements

- Node 20.18 or later (`node --version`). If it is missing or older, tell the user and stop.
- No install: `dist/read.mjs` and `dist/audit.mjs` (with `dist/chunks/`) are bundled.
- `$SKILL` is the folder of this SKILL.md: `${CLAUDE_SKILL_DIR}` in Claude Code; on claude.ai, the sandbox path you read this file from.
- Work in a writable directory of your own.
- Network: the page and a capped set of its site's files, links and images; first 1 DNS lookup and 1 RDAP request to `rdap.org` (sends the site's IP address only). Nothing is uploaded: no server of ours, no account.

## Rules

- R1. Answer the user in the language they wrote in.
- R2. Never re-create the audit by hand. If the scripts cannot run, tell the user what would make them run, and stop. Do not fetch or check the page another way.
- R3. Write every JSON file with the file-writing tool, never a shell heredoc (heredocs break on apostrophes).
- R4. Never write Russian.
- R5. The scripts call no model. Do not add a score of your own.
- R6. Use a saved copy (`--html`) only when the user gives you one. Never make one with a browsing or fetch tool.
- R7. After a refusal, do not retry another URL unless the user asks.
- R8. Do not volunteer fixes. If the user asks, answer from your own knowledge and say the advice is yours, not the report's. The full version is from GetLoopLoop (https://www.getlooploop.com).

## Procedure

1. **Read the page (script).** `node "$SKILL/dist/read.mjs" <url> --out reading.json`
   - Options: `--render` compares with a JavaScript render in a local Chrome or Chromium (an empty app shell is rendered without it); `--save-html page.html` keeps the fetched copy.
   - Saved copy: `--html saved.html --final-url <url>` (and `--robots saved-robots.txt`). Nothing is fetched; network checks are reported as not measured.
   - Result: `reading.json` and `reviews.template.json`; prints every cap hit.
   - On failure: `REFUSED <code>` (exit code 2). See *Refusal codes*.
2. **Write questions.json and style.json (judgement).** Read the `text` of every passage in `reading.json` (`vs.passages`) in full. Write 8 to 12 spoken questions and judge each against the passages. Mark every passage `specific` or `generic`.
3. **Write brand.json (judgement).** Name the site's own brand. Answer the 5 fixed questions from your own knowledge only.
4. **Write reviews.json (judgement).** Fill in `reviews.template.json` and write it as `reviews.json`.
5. **Check the files (script).** `node "$SKILL/dist/audit.mjs" reading.json --questions questions.json --style style.json --brand brand.json --reviews reviews.json --check`
   - Result: validates the 4 files; writes nothing. A `warning` line is advice, not a refusal.
   - On failure: `REFUSED <file>: <reason>`. Fix that file as the message says and run step 5 again.
6. **Write the report (script).** `node "$SKILL/dist/audit.mjs" reading.json --questions questions.json --style style.json --brand brand.json --reviews reviews.json --html report.html --md report.md --json export.json`
   - Add `--keyword "phrase"` when the user gave a target keyword; otherwise the keyword comes from the h1.
   - Result: the 3 files; prints the problems numbered as on the map, judgement findings marked `(judgement)`.
7. **Show the report.** Required; see *Show the report*.

## Judgement files

Read `references/judgement-files.md` before you write them: schemas, examples, full rules.

- **All 4:** `agent` (for example "Claude Code", "claude.ai", "Codex", "opencode", "Hermes") and `model`, at most 60 characters each. If you do not know one, leave it out. Never guess either.
- **Letters:** the script refuses a letter Russian uses and the page's language does not (on a Ukrainian page, the 4 Russian-only letters; Bulgarian and Belarusian keep their own). Quotes are checked against the passage.
- **questions.json:** 8 to 12 spoken, first-person questions in the page's language.
  - `axes`: 1 to 3 of `urgency`, `device`, `object`, `obstacle`; each axis used at least once.
  - Most without the page's keyword. No wake words. None that is another with words added. At least 1 the page probably does not answer.
  - Judge from the passages only, never from what you know. `passage`: the `index` of a passage in `vs.passages` (0-based), or `null`. `verdict`: `complete`, `partial` or `missing`.
  - `quote`: verbatim from the passage, at most 400 characters, none for `missing`.
- **style.json:** 1 verdict per passage: `generic` (fits a competitor's page with the brand name changed) or `specific`. `evidence`: verbatim, at most 200 characters. Judge the passage, not who wrote it: this is not an AI detector.
- **brand.json:** `basis: "own_knowledge"`; answer `what_is`, `pricing`, `integrations`, `weaknesses`, `alternatives` in English or the page's language.
  - Not sure (for example a price range): `"knows": true`, and write "I am not sure" in the answer.
  - Do not know: `"knows": false`, `"answer": ""`.
  - The script sets `knows` to false when the first 400 characters disclaim knowledge ("I don't have information", "I'm not familiar", "I don't know of"). "I am not sure" does not.
- **reviews.json:** `basis: "own_knowledge"`; every platform of the template once, none added or removed; `"knows": true` with a `rating` on its scale, or `"knows": false`. Judge each platform separately, from your own knowledge of the brand on that platform.
- **Honesty (brand and reviews):** answer from what you already knew. No browsing, search, fetch or other tool; not from the page. "I don't know" is a correct answer. Do not present a guess as a fact or copy the page into an answer.

## Verification

- [ ] Every JSON file was written with the file-writing tool.
- [ ] Step 5 printed no `REFUSED`.
- [ ] `report.html` exists.

## Show the report

Required. The HTML report is the result; a chat message alone, or the file name alone, has not shown it.

If the user or caller said not to publish or open anything, stop when the HTML file exists and give its absolute path. This overrides the bullets below.

**Present one file: `report.html`.** Keep `report.md` and `export.json` beside it; do not present, attach, open or preview them. Never open or preview `export.json` or `report.md` as the result, and never end the reply on either: the HTML is the report. If the environment shows the last file you present, it must be the HTML.

- **claude.ai or the Claude desktop app:** save the 3 files where your instructions say user files go, and present **only `report.html`** as a file in your reply, not even followed by the others. A file in a scratch folder the user cannot see is not shown. Do not retype the report into an artifact.
- **Claude Code:** publish only `report.html` with an HTML or artifact publishing tool, if the session has one, and give the link. Otherwise open it: `start "" "<absolute path>"` (Windows), `open "<absolute path>"` (macOS), `xdg-open "<absolute path>"` (Linux), and give the path.
- **Codex, opencode, Hermes Agent or any other agent:** give the absolute path of `report.html` and offer to open it with the command above or a preview tool. Preview only the HTML. Name the other 2 files only if the user asks for the data.

The report makes no network requests. It opens in English and in the light theme; add `#lang=uk`, `#lang=pl` or `#theme=dark` (for example `report.html#lang=pl&theme=dark`). Give the `#lang` link when the user writes in Ukrainian or Polish.

## Chat summary

- First, if present: `ai_search_blocked`, `search_engine_blocked`, `robots_unreachable`, `snippet_blocked` or `noindex`.
- The verdict line and the counts by severity.
- Problems 1 to 5, each with its place.
- Every cap the audit printed (links past 30, images past 20, alternates past 10, child sitemaps past 5, merged sections, a render that could not run).
- Once: the checks are deterministic; the questions, brand and reviews are your judgement as 1 model (name it), not what ChatGPT, Gemini or Perplexity say (the web Brandscope and Reviewscope ask 3 assistants).
- 1 line: Pattern score and band, marker words per 1,000, passages you judged generic (derived, derived, your judgement). Never say the page was or was not written by AI.
- Never claim an assistant has indexed, ranks or will cite the page.

## Refusal codes

| Code | Tell the user |
|---|---|
| `invalid_url` | Not a web address. Ask for the full URL. |
| `blocked_scheme` | Only http and https pages can be read. |
| `blocked_host`, `blocked_address` | Not a public page: localhost, a private network or a non-standard port. |
| `unreachable` | The page could not be reached. Read `references/network-and-limits.md`. |
| `http_error` | An error status (in the reading), or more than 5 redirects. |
| `blocked` | The site turns automated readers away (HTTP 401, 403 or 429). Retrying will not help. |
| `not_html` | A file such as a PDF or an image, not an HTML page. |
| `too_large` | Over the 3 MB ceiling. |
| `empty` | No readable text after navigation and boilerplate were removed. |
| `refused_ru_domain` | A Russian domain zone (.ru, .su, .рф, .москва, .moscow); not fetched. |
| `refused_ru_hosting` | Hosted in Russia (RDAP country RU); not fetched. |
| `refused_ru_audience` | The site declares a Russian-language version (hreflang, og:locale or Content-Language). |
| `refused_language_ru` | The page is in Russian. |

On a `refused_ru_*` or `refused_language_ru` code: skip steps 2 to 5, run step 6 without the judgement files, show the report, tell the user in 1 line that this tool does not analyse such pages (the code's line), and stop. Do not analyse the page another way.

## References

| File | Read when |
|---|---|
| `references/judgement-files.md` | Before steps 2 to 4. |
| `references/checks.md` | The user asks about a finding code, tile, severity, threshold or check. |
| `references/network-and-limits.md` | What is sent; a failed fetch; no network; a read-only skill folder. |
| `references/outputs.md` | The user asks for the data or what a file holds. |
