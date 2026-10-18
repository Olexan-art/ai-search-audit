# The judgement files: schemas and full rules

Read this when you write `questions.json`, `style.json`, `brand.json` and `reviews.json` (steps 2 to 4). The `--check` run validates every rule here that a script can check.

## All 4 files

- Write each file with the file-writing tool, never a shell heredoc (heredocs break on apostrophes).
- `agent`: the product you run in ("Claude Code", "claude.ai", "Codex", "opencode", "Hermes"). `model`: your model's name as you know it. At most 60 characters each.
- Fill in both honestly. If you do not know one, leave it out; the report says "model not stated". Never guess or invent either.
- Write questions in the page's language, and brand and review answers in English or the page's language. Never Russian.
- The script refuses a letter Russian uses and the page's own language does not. On a Ukrainian page, these are the 4 letters only Russian writes there. A Bulgarian or Belarusian page keeps the letters its own words use.
- Quotes are the page's own words; the script checks them against the passage instead.

## questions.json

```json
{
  "agent": "<your agent>",
  "model": "<your model name>",
  "topic": "what the page is about, in a few words",
  "questions": [
    { "id": "q1", "question": "My launch is tomorrow: will an assistant see the FAQ at the bottom?", "axes": ["urgency", "object"],
      "passage": 5, "verdict": "partial", "citable": false, "quote": "verbatim words from passage 5" },
    { "id": "q2", "question": "Can I paste a PDF instead of a web page?", "axes": ["object"], "passage": null, "verdict": "missing" }
  ]
}
```

Cross the page's topic with a real circumstance (the GetLoopLoop Voicescope method), varied along 4 axes:

- `urgency`: now, on the move, or against a deadline.
- `device`: who asks and on what (a phone, hands busy, somebody watching).
- `object`: the specific document, page, account or person in front of them.
- `obstacle`: the mistake already made, the thing they cannot find or fear getting wrong.

Rules, most often broken first:

1. Most questions must not contain the page's keyword.
2. Write speech, in the first person, in the page's language.
3. No wake words ("Hey Google", "Siri").
4. No question that is another with words added.
5. At least 1 question the page probably does not answer.
6. 8 to 12 questions. `id`: short, such as `q1`. `question`: at most 200 characters.
7. `axes`: 1 to 3 per question, never all 4. Every axis used at least once in the file.

Judge each question from the passages only, never from what you know:

- `passage`: the 1 passage a retriever should return, or `null` when none does. Required for `complete` and `partial`.
- `verdict`: `complete` (that passage alone answers it), `partial` (it helps but leaves part out) or `missing`.
- `citable`: true only when the quoted words make sense quoted alone. A `missing` answer is never citable.
- `quote`: the exact words that answer, at most 400 characters, verbatim from that passage. Required for `complete` and `partial`; none for `missing`. The script folds whitespace, quote marks, dashes and case, nothing else, and refuses a quote not in its passage.

## style.json

```json
{ "agent": "<your agent>", "model": "<your model name>",
  "passages": [
    { "passage": 3, "verdict": "specific", "evidence": "Free for up to 5 clients.", "why": "a limit a reader can check" },
    { "passage": 5, "verdict": "generic", "evidence": "unlock its full potential", "why": "names no integration" } ] }
```

The swap test: would the passage fit a competitor's page with only the brand name changed?

- 1 verdict for every passage in `vs.passages`, each once.
- `generic`: yes. `specific`: it holds something only this page could say (a number, a name, a limit, a procedure, a first-hand detail).
- `evidence`: the words that decided it, verbatim from that passage, at most 200 characters.
- `why`: optional, 1 short line in the user's language.
- Judge the passage, not the page, and not who wrote it. This is not an AI detector.

The report shows your verdicts beside the Pattern score and the marker words, and averages nothing.

## brand.json

```json
{
  "agent": "<your agent>",
  "model": "<your model name>",
  "brand": "BrightDesk",
  "basis": "own_knowledge",
  "answers": [
    { "question": "what_is", "knows": true, "answer": "BrightDesk is a help desk for small support teams. …" },
    { "question": "pricing", "knows": true, "answer": "I am not sure of the exact prices. I believe plans start at about $15 per agent per month." },
    { "question": "integrations", "knows": true, "answer": "…" },
    { "question": "weaknesses", "knows": false, "answer": "" },
    { "question": "alternatives", "knows": true, "answer": "…" }
  ]
}
```

`brand`: the site's own name, at most 80 characters. Answer each of the 5 fixed GetLoopLoop Brandscope questions once. Ask them of yourself in this wording:

1. `what_is`: What is <brand>? Answer in two sentences.
2. `pricing`: How much does <brand> cost? Name the plans and prices you know of. If you are not sure, say so.
3. `integrations`: What does <brand> integrate with? Name the integrations you know of.
4. `weaknesses`: What are the main weaknesses or complaints about <brand> compared with its alternatives?
5. `alternatives`: What are the main alternatives to <brand>, and when would somebody pick one of them instead?

**Answers.** `answer`: at most 1,500 characters; required when `knows` is true.

- You know and are sure: `"knows": true`.
- You know something but are not sure (for example a price range): `"knows": true`, and write in the answer that you are not sure ("I am not sure of the exact prices.").
- You do not know: `"knows": false` and `"answer": ""`.

**How the script reads `knows`.** If the first 400 characters of an answer disclaim knowledge of the brand, the script counts it as `"knows": false`, whatever you set. Phrases that do this: "I don't have information" (or details, data, knowledge), "I have no information", "I'm not familiar", "I'm not aware", "I don't know of", "I don't know about", "I don't know any", "I could not find", "unable to find", "may not exist", "no publicly available information", "does not appear to be a well-known". "I am not sure" and "I don't know the exact price" match none of them.

**Honesty rules.**

- `basis` must be `"own_knowledge"`.
- Answer from what you already knew. Use no browsing, search, fetch or other tool for this step, even if one is available. Do not answer from the page.
- "I don't know" is a correct answer and the most useful one when it is true: write `"knows": false`.
- Do not present a guess as a fact. Do not copy the page into an answer.

**What the script compares** (fixed Brandscope rules):

- Contradiction: a price, or a number of the same thing ("3 agents", "26 passages"), that the page states differently.
- Fact the page lacks: a sentence of `what_is`, `pricing` or `integrations` whose numbers and names are not on the page.
- Brand unknown: no answer of the 5 knows the brand.
- Complaints are never checked against the brand's own page. Alternatives are other brands.

## reviews.json

```json
{
  "agent": "<your agent>",
  "model": "<your model name>",
  "brand": "BrightDesk",
  "basis": "own_knowledge",
  "platforms": [
    { "platform": "g2", "knows": true, "rating": 4.5, "reviews": 120 },
    { "platform": "capterra", "knows": false },
    …
  ]
}
```

Start from `reviews.template.json`. `read.mjs` writes it beside the reading (beside `site.json` for a site). It lists every platform of this run once, with `name` and `scale`, and `"knows"` empty.

- Keep exactly those platforms. Add none, remove none.
- Set `"knows"` to `true` with a `rating`, or to `false`.
- `rating`: out of 5; TrustRadius out of 10; Product Hunt a whole count of upvotes.
- `reviews` (a whole count) is optional. `name` and `scale` may stay or go.
- The honesty rules of brand.json apply. Judge each platform separately, from your own knowledge of the brand on that platform.

The script flags a rating that cannot be right, and every stated rating with no source on the page (no mention of the platform, no link to it, no rating markup). The report says which ratings and why.
