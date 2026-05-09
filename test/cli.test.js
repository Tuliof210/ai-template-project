"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { run } = require("../src/cli");

test("init installs managed files without overwriting existing files", async () => {
  const target = await fs.mkdtemp(path.join(os.tmpdir(), "ai-template-init-"));
  const existingSkill = path.join(target, ".codex/skills/spec-write/SKILL.md");

  await fs.mkdir(path.dirname(existingSkill), { recursive: true });
  await fs.writeFile(existingSkill, "local edit\n");

  const output = createOutput();
  await run(["init", "--cwd", target], output);

  const preserved = await fs.readFile(existingSkill, "utf8");
  const modelGuide = await fs.readFile(path.join(target, "meta/models.md"), "utf8");
  const featureKeep = await fs.readFile(path.join(target, "meta/features/.gitkeep"), "utf8");

  assert.equal(preserved, "local edit\n");
  assert.match(modelGuide, /Mega guia/);
  assert.equal(featureKeep, "");
  assert.match(output.stdout.text, /skipped: 1/);
});

test("sync updates managed files", async () => {
  const target = await fs.mkdtemp(path.join(os.tmpdir(), "ai-template-sync-"));
  const existingModelGuide = path.join(target, "meta/models.md");

  await fs.mkdir(path.dirname(existingModelGuide), { recursive: true });
  await fs.writeFile(existingModelGuide, "old model guide\n");

  const output = createOutput();
  await run(["sync", "--cwd", target], output);

  const syncedModelGuide = await fs.readFile(existingModelGuide, "utf8");

  assert.match(syncedModelGuide, /Mega guia/);
  assert.match(output.stdout.text, /updated: 1/);
});

test("news prints package news", async () => {
  const output = createOutput();
  await run(["news"], output);

  assert.match(output.stdout.text, /AI Template News/);
  assert.match(output.stdout.text, /Unreleased/);
  assert.match(output.stdout.text, /spec-write/);
  assert.match(output.stdout.text, /spec-run/);
  assert.doesNotMatch(output.stdout.text, /0\.1\.3/);
});

function createOutput() {
  return {
    stdout: captureStream(),
    stderr: captureStream()
  };
}

function captureStream() {
  return {
    text: "",
    write(chunk) {
      this.text += chunk;
    }
  };
}
