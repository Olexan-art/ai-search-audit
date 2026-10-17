# Vendored: the Vectorscope skill's code

The reading, the robots.txt rules, the passage checks, the language detection and the refusal
in this skill are the Vectorscope skill's own code, copied here unchanged so this repository
stands on its own.

- Source: https://github.com/Olexan-art/getlooploop-skills, `skills/vectorscope/scripts/lib/`
- Commit: `a2cfdd1`
- Vectorscope version: 2.110.0
- Licence: MIT, the same holder; the source repository's licence is in [LICENSE](LICENSE).

The files are byte-for-byte copies. Do not edit them here: change them in getlooploop-skills,
then copy them again from a checkout of it:

```
node tools/sync-vectorscope.mjs <path to getlooploop-skills>
npm run build && npm test
```

The set is every module that `scripts/` and `tests/` import from this folder, and what those
import in turn (24 files):

- `accessibility.mjs`
- `analysis.mjs`
- `brandmark.mjs`
- `checks.mjs`
- `chunk.mjs`
- `extract.mjs`
- `fetchPage.mjs`
- `guards.mjs`
- `html.mjs`
- `i18n.mjs`
- `judgement.mjs`
- `language.mjs`
- `lens.mjs`
- `losses.mjs`
- `metrics.mjs`
- `nonPageUrl.mjs`
- `reading.mjs`
- `refusal.mjs`
- `render.mjs`
- `robots.mjs`
- `russianSite.mjs`
- `sprites.mjs`
- `technical.mjs`
- `vocabulary.mjs`

The tests also read these Vectorscope test fixtures, copied to `tests/fixtures/vectorscope/`:

- `example-com.html`
- `getlooploop-vectorscope.html`
- `uk-vectorscope.html`
- `mdn-http-caching.html`
- `mdn-http-caching.ATTRIBUTION.txt`
- `russian-sample.txt`
