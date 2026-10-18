# Outputs: what each file holds

Read this when the user asks for the data (the Markdown or the JSON), or what the report or the export holds.

- `report.html`: 1 self-contained page (inline CSS, 1 small script, favicons as data URIs, a content security policy that blocks every network request, all page text escaped). Light by default, dark on the toggle; English, Ukrainian and Polish; safe down to 375 px.
  - Summary first: a headline built from the findings, the severity counts, 3 cards (robots can find it, the text, the brand and questions), the 3 findings to review first, and the places in the document with the selected one beside them.
  - Technical details are in 1 closed section, *All checks and technical details*.
  - Judgement findings carry an "Agent's judgement · <model>" badge; a note says brand, reviews and questions are 1 model's view.
  - It opens in English and in the light theme; `#lang=uk`, `#lang=pl` and `#theme=dark` change that (for example `report.html#lang=pl&theme=dark`).
- `report.md`: the same audit in English Markdown: the status, the biggest problems, every problem with its code, place and layer, the page map as a list, the checklist, the bots, the language versions, where the text goes, and what was not checked.
- `export.json` (`getlooploop/ai-search-audit@1`): every finding with `code`, `severity`, `area`, `owner`, `layer`, `judgement` (`agent`, `model`, or `null`), `label` (en, uk), `where`, `map` (zones and strip rows), `passages`, `evidence` and `rules` (each `{ name, url }`); plus the tiles, the checklist, the page map, robots, sitemap, llms.txt, languages, alternates, links, structured data, `keyword`, `writingPatterns`, `generatedText` (Pattern score, marker words, swap test, per passage), `localeFacts`, `judgement` (the files as validated), the reading's waterfall, `notChecked` (every cap) and `notMeasured`.
- `reading.json` (`getlooploop/ai-search-audit-reading@1`): everything step 1 read, so step 6 can run again offline.

Source: `scripts/` in the repository, built into `dist/` with esbuild. Tests: `npm test` in the skill folder of a checkout.
