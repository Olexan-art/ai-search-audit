#!/usr/bin/env node
// Copies the Vectorscope code this skill uses from a getlooploop-skills checkout into
// scripts/vendor/vectorscope/, and the Vectorscope test fixtures its tests read into
// tests/fixtures/vectorscope/, then rewrites VENDORED.md with the source commit and version.
//
//   node tools/sync-vectorscope.mjs ../../../getlooploop-skills
//
// Which files: every module that scripts/ and tests/ import from vendor/vectorscope/, and every
// module those import in turn, found by reading the import statements of the checkout's copies.
// The files are copied byte for byte: vendored code is not edited (it imports its siblings with
// "./x.mjs", so a flat folder needs no path changes). After a sync: npm run build && npm test.

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VENDOR_DIR = join(SKILL_DIR, "scripts", "vendor", "vectorscope");
const FIXTURE_DIR = join(SKILL_DIR, "tests", "fixtures", "vectorscope");
// The Vectorscope test fixtures this skill's tests read (tests/helpers.mjs vsFixture() and
// tests/refusal.test.mjs), with the attribution that travels with the MDN page.
const FIXTURES = [
  "example-com.html",
  "getlooploop-vectorscope.html",
  "uk-vectorscope.html",
  "mdn-http-caching.html",
  "mdn-http-caching.ATTRIBUTION.txt",
  "russian-sample.txt",
];

const checkout = process.argv[2];
if (!checkout) {
  console.error("usage: node tools/sync-vectorscope.mjs <path to a getlooploop-skills checkout>");
  process.exit(1);
}
const SOURCE = resolve(checkout);
const SOURCE_LIB = join(SOURCE, "skills", "vectorscope", "scripts", "lib");
const SOURCE_FIXTURES = join(SOURCE, "skills", "vectorscope", "tests", "fixtures");
if (!existsSync(SOURCE_LIB)) {
  console.error(`not a getlooploop-skills checkout: ${SOURCE_LIB} does not exist`);
  process.exit(1);
}

const specifiers = (path) => [...readFileSync(path, "utf8").matchAll(/(?:\bfrom|\bimport)\s*\(?\s*["']([^"']+)["']/g)].map((m) => m[1]);
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = join(dir, e.name);
        if (e.isDirectory()) return p === VENDOR_DIR ? [] : walk(p);
        return p.endsWith(".mjs") ? [p] : [];
      })
    : [];

// The roots: what this skill's own code imports from the vendored folder.
const wanted = new Set();
for (const file of [...walk(join(SKILL_DIR, "scripts")), ...walk(join(SKILL_DIR, "tests"))]) {
  for (const spec of specifiers(file)) {
    if (!spec.startsWith(".")) continue;
    const target = resolve(dirname(file), spec);
    if (dirname(target) === VENDOR_DIR) wanted.add(basename(target));
  }
}
// Transitively, in the source.
const stack = [...wanted];
while (stack.length) {
  const name = stack.pop();
  const path = join(SOURCE_LIB, name);
  if (!existsSync(path)) {
    console.error(`${name} is imported but not in ${SOURCE_LIB}`);
    process.exit(1);
  }
  for (const spec of specifiers(path)) {
    if (!spec.startsWith("./")) continue;
    const dep = basename(spec);
    if (!wanted.has(dep)) {
      wanted.add(dep);
      stack.push(dep);
    }
  }
}

mkdirSync(VENDOR_DIR, { recursive: true });
mkdirSync(FIXTURE_DIR, { recursive: true });
const modules = [...wanted].sort();
for (const name of modules) copyFileSync(join(SOURCE_LIB, name), join(VENDOR_DIR, name));
for (const name of FIXTURES) copyFileSync(join(SOURCE_FIXTURES, name), join(FIXTURE_DIR, name));
copyFileSync(join(SOURCE, "LICENSE"), join(VENDOR_DIR, "LICENSE"));

const stale = readdirSync(VENDOR_DIR).filter((f) => f.endsWith(".mjs") && !wanted.has(f));

let commit = "unknown";
try {
  commit = execFileSync("git", ["-C", SOURCE, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
} catch {
  // not a git checkout; the commit stays unknown
}
const version = JSON.parse(readFileSync(join(SOURCE, "skills", "vectorscope", "package.json"), "utf8")).version;

const doc = `# Vendored: the Vectorscope skill's code

The reading, the robots.txt rules, the passage checks, the language detection and the refusal
in this skill are the Vectorscope skill's own code, copied here unchanged so this repository
stands on its own.

- Source: https://github.com/Olexan-art/getlooploop-skills, \`skills/vectorscope/scripts/lib/\`
- Commit: \`${commit}\`
- Vectorscope version: ${version}
- Licence: MIT, the same holder; the source repository's licence is in [LICENSE](LICENSE).

The files are byte-for-byte copies. Do not edit them here: change them in getlooploop-skills,
then copy them again from a checkout of it:

\`\`\`
node tools/sync-vectorscope.mjs <path to getlooploop-skills>
npm run build && npm test
\`\`\`

The set is every module that \`scripts/\` and \`tests/\` import from this folder, and what those
import in turn (${modules.length} files):

${modules.map((m) => `- \`${m}\``).join("\n")}

The tests also read these Vectorscope test fixtures, copied to \`tests/fixtures/vectorscope/\`:

${FIXTURES.map((f) => `- \`${f}\``).join("\n")}
`;
writeFileSync(join(VENDOR_DIR, "VENDORED.md"), doc);

console.log(`copied ${modules.length} modules and ${FIXTURES.length} fixtures from ${commit} (Vectorscope ${version})`);
if (stale.length) console.log(`not imported any more, delete by hand: ${stale.join(", ")}`);
