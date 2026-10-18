// The four letters that exist in Russian and not in Ukrainian, kept in the vendored Vectorscope
// module so every check in both skills reads one definition.
export { RUSSIAN_ONLY } from "../vendor/vectorscope/russian.mjs";

// Russian shares these four letters with other Cyrillic languages: Bulgarian writes U+044A in a
// large share of its words, Belarusian, Kazakh, Kyrgyz and Mongolian write U+044B, U+044D and U+0451.
// The language gate has already let the page through, so in text the agent writes in the page's
// language a letter is allowed when the page's own words use it (at least NATIVE_SHARE of its
// Cyrillic words), and refused otherwise: a Ukrainian page never uses any of them.
export const NATIVE_SHARE = 0.02;
const SHARED = ["\u044b", "\u044a", "\u044d", "\u0451"];
const CYRILLIC_WORD = /[\u0400-\u04ff\u0500-\u052f]+/g;

/** The shared letters the page's own language uses, from its passages ([{text}]). */
export function nativeLetters(passages = []) {
  const words = passages.flatMap((p) => (p.text || "").toLowerCase().match(CYRILLIC_WORD) || []);
  if (!words.length) return new Set();
  return new Set(SHARED.filter((l) => words.filter((w) => w.includes(l)).length / words.length >= NATIVE_SHARE));
}

/** True when the text holds a shared letter the page's language does not use. */
export const foreignLetters = (text, native) => [...(text || "").toLowerCase()].some((c) => SHARED.includes(c) && !native.has(c));
