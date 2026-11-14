// `audit.mjs --codes` and `audit.mjs --explain <code>`: what a code means, from this skill's own
// registry (checks.mjs), titles (titles.mjs), rule sources (rules.mjs) and rubrics (rubrics.mjs).
// No network, no reading needed. Lite shows labels only, so there is no description or fix
// direction here: the Full edition adds them, with the rule quoted from its source.

import { CODES, CODE_ORDER } from "./checks.mjs";
import { AREAS, OWNERS } from "./copy.mjs";
import { source } from "./rules.mjs";
import { RUBRICS } from "./rubrics.mjs";
import { TITLES } from "./titles.mjs";

export const EXPLAIN_LANGS = ["en", "uk", "pl"];
const FULL_URL = "https://github.com/Olexan-art/ai-search-audit-full";

const H = {
  severity: ["severity", "серйозність", "waga"],
  tile: ["tile", "плитка", "kafelek"],
  owner: ["owner", "хто виправляє", "kto poprawia"],
  layer: ["layer", "шар", "warstwa"],
  sources: ["Rule sources", "Джерела правила", "Źródła reguły"],
  rubric: ["Verifier rubric (references/checks.md)", "Рубрика перевірки (references/checks.md)", "Rubryka weryfikacji (references/checks.md)"],
  lite: [`Lite shows short labels only. The Full edition adds a plain description, the rule quoted from its source and a fix direction: ${FULL_URL}`, `Lite показує лише короткі мітки. Версія Full додає простий опис, правило з цитатою з джерела й напрям виправлення: ${FULL_URL}`, `Lite pokazuje tylko krótkie etykiety. Edycja Full dodaje prosty opis, regułę zacytowaną ze źródła i kierunek poprawki: ${FULL_URL}`],
};

/** Is this a code of this skill? */
export const isCode = (code) => Object.prototype.hasOwnProperty.call(CODES, code);

/** Every code with its one-line title, in registry order. */
export function codesText(lang = "en") {
  const i = EXPLAIN_LANGS.indexOf(lang);
  const width = Math.max(...CODE_ORDER.map((c) => c.length));
  return CODE_ORDER.map((c) => `${c.padEnd(width)}  ${CODES[c].severity.padEnd(8)}  ${TITLES[c][i]}`).join("\n");
}

/** One code: title, severity, tile, owner, layer, rule sources and its rubric. */
export function explainText(code, lang = "en") {
  const i = EXPLAIN_LANGS.indexOf(lang);
  const reg = CODES[code];
  const area = AREAS.find((a) => a.id === reg.area);
  const out = [`${code} · ${TITLES[code][i]}`, `${H.severity[i]}: ${reg.severity} · ${H.tile[i]}: ${area ? area.q[i] : reg.area} · ${H.owner[i]}: ${OWNERS[reg.owner][i]} · ${H.layer[i]}: ${reg.layer || "measured"}`, "", `${H.sources[i]}:`];
  for (const key of reg.rules) {
    const s = source(key);
    out.push(`  - ${s.name}${s.url ? `: ${s.url}` : ""}`);
  }
  const rubric = RUBRICS[code];
  if (rubric) {
    out.push("", `${H.rubric[i]}:`);
    for (const c of rubric.keepWhen) out.push(`  keepWhen ${c.id}  ${c.text}`);
    for (const c of rubric.dropWhen) out.push(`  dropWhen ${c.id}  ${c.text}`);
  }
  out.push("", H.lite[i]);
  return out.join("\n");
}
