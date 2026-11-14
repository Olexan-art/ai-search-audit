// The version is written twice: SKILL_VERSION (what reports and exports carry) and package.json
// (what npm and a release tag read); SKILL.md states it a third time. They are held together here.
// Versions count in thousandths — 2.101, 2.102, … — and package.json writes 2.101 as 2.101.0.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SKILL_VERSION } from "../scripts/lib/version.mjs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const skill = readFileSync(new URL("../SKILL.md", import.meta.url), "utf8");

test("SKILL_VERSION, package.json and SKILL.md name the same version", () => {
  assert.equal(`${SKILL_VERSION}.0`, pkg.version);
  assert.ok(skill.includes(`Version ${SKILL_VERSION}.`), "SKILL.md states the version");
});

test("the minor part is three digits, so versions count in thousandths", () => {
  assert.match(SKILL_VERSION, /^\d+\.\d{3}$/);
});

// The plugin manifests at the repository root (Antigravity, Gemini CLI, Claude Code) each write the
// version again; they must name the skill's version, or an install reports another release.
const repoRoot = new URL("../../../", import.meta.url);
const manifest = (p) => JSON.parse(readFileSync(new URL(p, repoRoot), "utf8"));

test("every plugin manifest names the skill's version", () => {
  const want = `${SKILL_VERSION}.0`;
  assert.equal(manifest("plugin.json").version, want, "plugin.json");
  assert.equal(manifest("gemini-extension.json").version, want, "gemini-extension.json");
  assert.equal(manifest(".claude-plugin/plugin.json").version, want, ".claude-plugin/plugin.json");
  for (const p of [".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json"]) {
    for (const plugin of manifest(p).plugins) assert.equal(plugin.version, want, `${p}: ${plugin.name}`);
  }
});

test("the manifests name the skill and one marketplace, as the READMEs tell people to type", () => {
  const names = [manifest("plugin.json").name, manifest("gemini-extension.json").name, manifest(".claude-plugin/plugin.json").name, ...manifest(".claude-plugin/marketplace.json").plugins.map((p) => p.name), ...manifest(".agents/plugins/marketplace.json").plugins.map((p) => p.name)];
  assert.deepEqual([...new Set(names)], ["ai-search-audit"]);
  const market = manifest(".claude-plugin/marketplace.json").name;
  assert.equal(market, manifest(".agents/plugins/marketplace.json").name);
  for (const readme of ["README.md","README.uk.md","README.pl.md"]) {
    const text = readFileSync(new URL(readme, repoRoot), "utf8");
    assert.ok(text.includes("agy plugin install https://github.com/Olexan-art/ai-search-audit"), `${readme}: Antigravity`);
    assert.ok(text.includes("/plugin marketplace add Olexan-art/ai-search-audit"), `${readme}: Claude Code marketplace`);
    assert.ok(text.includes(`/plugin install ai-search-audit@${market}`), `${readme}: Claude Code install`);
  }
});
