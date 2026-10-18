// A page in another Cyrillic language passes the language gate, so its questions must pass too:
// the quote is the page's own text, and the question is written in the page's language. The
// letters are escapes, so this file holds no Russian-only letters of its own.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateQuestions } from "../scripts/lib/questions.mjs";
import { nativeLetters } from "../scripts/lib/russian.mjs";

const HARD = "ъ";
const YERU = "ы";
const words = (n, letter) => Array.from({ length: n }, (_, i) => (i % 3 === 0 ? `с${letter}м` : "дом")).join(" ");

const passages = (letter) => [{ index: 0, text: `${words(60, letter)}.` }];
const file = (letter, question) => ({
  questions: ["urgency", "device", "object", "obstacle", "object", "object", "object", "object"].map((axis, i) => ({
    id: `q${i + 1}`, question: i === 0 ? question : `дом ${i}?`, axes: [axis],
    passage: i === 7 ? null : 0, verdict: i === 7 ? "missing" : "partial", citable: false,
    ...(i === 7 ? {} : { quote: `с${letter}м дом` }),
  })),
});

test("a Bulgarian page: the hard sign in its quotes and questions is allowed", () => {
  assert.deepEqual([...nativeLetters(passages(HARD))], [HARD]);
  assert.doesNotThrow(() => validateQuestions(file(HARD, `с${HARD}м?`), passages(HARD)));
});

test("a Belarusian page: yeru in its quotes and questions is allowed", () => {
  assert.doesNotThrow(() => validateQuestions(file(YERU, `с${YERU}м?`), passages(YERU)));
});

test("a page that does not use a letter still refuses it in what the agent writes", () => {
  const ukrainian = [{ index: 0, text: `${Array.from({ length: 60 }, () => "дім").join(" ")}.` }];
  assert.equal(nativeLetters(ukrainian).size, 0);
  const f = file("і", `с${YERU}м?`);
  f.questions.forEach((q) => { if (q.quote) q.quote = "дім"; });
  assert.throws(() => validateQuestions(f, ukrainian), /Russian letters/);
});
