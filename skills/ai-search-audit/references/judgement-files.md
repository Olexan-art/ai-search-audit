# The judgement files: schemas and full rules

Read this before writing `questions.json`, `style.json`, `brand.json` and `reviews.json` (steps 2 to 4 of SKILL.md). The `--check` run validates every rule below that a script can check.

## Common to all four

Every file carries `agent` and `model` at the top level, as `groups.json` does in the Vectorscope skill: `agent` is the product you are running in ("Claude Code", "claude.ai", "Codex", "opencode", "Hermes"), `model` is your model's name as you know it. Up to 60 characters each. Fill them in honestly; if you do not know one, leave it out and the report says "model not stated". Never guess or invent either. The report prints the model beside every judgement finding.

**Never in Russian.** Questions and answers are in the page's language (or English for the brand and review answers), never Russian. What you write is refused if it holds a letter Russian uses that the page's own language does not: on a Ukrainian page, any of the four letters only Russian writes there; a Bulgarian or Belarusian page keeps the letters its own words use. Quotes are the page's own words and are checked against the passage instead.

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

Write 8 to 12 questions the way the GetLoopLoop Voicescope does: cross the page's topic with a real circumstance, and vary the circumstance along four axes, naming in `axes` the one to three each question uses (never all four in one question; every axis used at least once across the file):

- `urgency`: needed right now, on the move, or against a deadline;
- `device`: who is asking and on what (a phone, nothing installed, hands busy, somebody standing over them);
- `object`: the thing in front of them (the specific document, page, account, report or person);
- `obstacle`: what actually hurts (the mistake already made, the thing they cannot find, the thing they are afraid of getting wrong).

Rules, in the order they are usually broken: most questions must **not** contain the page's keyword (people describe the problem, not the jargon); write speech, in the first person, in the page's language; no wake words ("Hey Google", "Siri"); no question that is another with words added; include at least one the page probably does not answer.

Then judge each, from the passages only, never from what you know: `passage` is the single passage a retriever should return (`null` when none does); `verdict` is `complete` (that passage alone answers it), `partial` (it helps but leaves part out) or `missing`; `citable` is true only when the quoted words make sense quoted alone; `quote` is the exact words that answer, up to 400 characters, copied **verbatim** from that passage (whitespace, quote marks, dashes and case are folded, nothing else). A `missing` answer has no quote. The script refuses a quote that is not in its passage.

## style.json

```json
{ "agent": "<your agent>", "model": "<your model name>",
  "passages": [
    { "passage": 3, "verdict": "specific", "evidence": "Free for up to 5 clients.", "why": "a limit a reader can check" },
    { "passage": 5, "verdict": "generic", "evidence": "unlock its full potential", "why": "names no integration" } ] }
```

The swap test, one verdict for **every** passage in `vs.passages`: would this passage fit a competitor's page with only the brand name changed? `generic` if yes, `specific` if it holds something only this page could say (a number, a name, a limit, a procedure, a first-hand detail). `evidence` is the words that decided it, verbatim from that passage (at most 200 characters); `why` is optional, one short line in the user's language. Judge the passage, not the page, and not who wrote it: this is not an AI detector, and the report says so. The script checks every passage is judged once and every quote is verbatim. At the bottom of the report, *How generated the text sounds* shows your verdicts beside the Pattern score and the marker words; where they disagree it shows both and averages nothing.

## brand.json

```json
{
  "agent": "<your agent>",
  "model": "<your model name>",
  "brand": "BrightDesk",
  "basis": "own_knowledge",
  "answers": [
    { "question": "what_is", "knows": true, "answer": "BrightDesk is a help desk for small support teams. …" },
    { "question": "pricing", "knows": false, "answer": "" },
    { "question": "integrations", "knows": true, "answer": "…" },
    { "question": "weaknesses", "knows": false, "answer": "" },
    { "question": "alternatives", "knows": true, "answer": "…" }
  ]
}
```

`brand` is the brand the page belongs to (the site's own name). The five questions, the GetLoopLoop Brandscope's, fixed (ask them of yourself in this wording):

1. `what_is`: What is <brand>? Answer in two sentences.
2. `pricing`: How much does <brand> cost? Name the plans and prices you know of. If you are not sure, say so.
3. `integrations`: What does <brand> integrate with? Name the integrations you know of.
4. `weaknesses`: What are the main weaknesses or complaints about <brand> compared with its alternatives?
5. `alternatives`: What are the main alternatives to <brand>, and when would somebody pick one of them instead?

**Honesty rules.** `basis` must be `"own_knowledge"`: by writing it you state that the answers come from what you already knew, with no browsing, no search, no fetch and no reading of the page. Do not look anything up for this step, even if a tool is available. "I don't know" is a correct answer and the most useful one when it is true: write `"knows": false`. Do not soften a guess into a fact, and do not copy the page into an answer. Up to 1,500 characters per answer.

The script compares your answers with the page by fixed rules (from Brandscope): a **contradiction** is a price the page states differently, or a number of the same thing ("3 agents", "26 passages") the page states differently; a **fact the page lacks** is a sentence of the `what_is`, `pricing` or `integrations` answer whose numbers and names are not on the page; **brand unknown** is five answers that do not know it. Complaints are never checked against the brand's own page, and alternatives are other brands.

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

**Start from `reviews.template.json`**, which `read.mjs` writes beside the reading (beside `site.json` for a site): it lists every platform this run asks about, each once, with its name and its scale, and `"knows"` left empty. Keep exactly those platforms, none added or removed; set `"knows"` on each to true, with a `rating` on that platform's scale (out of 5; TrustRadius out of 10; Product Hunt a whole count of upvotes), or to false. `reviews` (a whole count) is optional, and the `name` and `scale` fields may stay or go. The same honesty rules as brand.json: own knowledge only, never browse, `"knows": false` when you do not know. Answer every platform the same way, from what you know of the brand on it.

The script flags a rating that cannot be right, and every rating you stated that has no source on the page (no mention of the platform, no link to it, no rating markup). The report says which ratings these are and why.
