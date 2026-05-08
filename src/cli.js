"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");

const syncEntries = [
  { source: ".claude/skills", target: ".claude/skills", kind: "directory" },
  { source: ".codex/skills", target: ".codex/skills", kind: "directory" },
  { source: "meta/rules", target: "meta/rules", kind: "directory" },
  { source: "meta/models.md", target: "meta/models.md", kind: "file" }
];

const initEntries = [
  ...syncEntries,
  { source: "meta/features/.gitkeep", target: "meta/features/.gitkeep", kind: "file" }
];

class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
  }
}

async function main(argv, io = process) {
  const exitCode = await run(argv, io);
  process.exitCode = exitCode;
}

async function run(argv, io = process) {
  const parsed = parseArgs(argv);

  if (parsed.help) {
    write(io.stdout, helpText());
    return 0;
  }

  if (parsed.command === "init") {
    const summary = await copyManagedFiles({
      targetRoot: parsed.cwd,
      entries: initEntries,
      overwrite: parsed.force
    });

    writeSummary(io.stdout, "Initialized AI Template files", parsed.cwd, summary);
    if (summary.skipped > 0 && !parsed.force) {
      write(io.stdout, "Existing files were left untouched. Run `ai-template sync` to update managed files.");
    }
    return 0;
  }

  if (parsed.command === "sync") {
    const summary = await copyManagedFiles({
      targetRoot: parsed.cwd,
      entries: syncEntries,
      overwrite: true
    });

    writeSummary(io.stdout, "Synced AI Template files", parsed.cwd, summary);
    return 0;
  }

  if (parsed.command === "news") {
    const news = await fs.readFile(path.join(packageRoot, "NEWS.md"), "utf8");
    write(io.stdout, news.trimEnd());
    return 0;
  }

  throw new CliError(`Unknown command: ${parsed.command}\n\n${helpText()}`);
}

function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift();
  const parsed = {
    command,
    cwd: process.cwd(),
    force: false,
    help: false
  };

  if (!command || command === "--help" || command === "-h" || command === "help") {
    parsed.help = true;
    return parsed;
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--force") {
      parsed.force = true;
      continue;
    }

    if (arg === "--cwd") {
      const value = args[index + 1];
      if (!value) {
        throw new CliError("Missing value for --cwd.");
      }
      parsed.cwd = path.resolve(value);
      index += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      parsed.cwd = path.resolve(arg.slice("--cwd=".length));
      continue;
    }

    throw new CliError(`Unknown option: ${arg}`);
  }

  parsed.cwd = path.resolve(parsed.cwd);
  return parsed;
}

async function copyManagedFiles({ targetRoot, entries, overwrite }) {
  const summary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    missing: []
  };

  await fs.mkdir(targetRoot, { recursive: true });

  for (const entry of entries) {
    const sourcePath = path.join(packageRoot, entry.source);
    const targetPath = path.join(targetRoot, entry.target);

    if (!(await pathExists(sourcePath))) {
      summary.missing.push(entry.source);
      continue;
    }

    if (entry.kind === "file") {
      await copyFile(sourcePath, targetPath, overwrite, summary);
      continue;
    }

    const files = await listFiles(sourcePath);
    for (const file of files) {
      await copyFile(
        path.join(sourcePath, file),
        path.join(targetPath, file),
        overwrite,
        summary
      );
    }
  }

  return summary;
}

async function copyFile(sourcePath, targetPath, overwrite, summary) {
  const targetExists = await pathExists(targetPath);

  if (targetExists && !overwrite) {
    summary.skipped += 1;
    return;
  }

  const sourceBuffer = await fs.readFile(sourcePath);

  if (targetExists) {
    const targetBuffer = await fs.readFile(targetPath);
    if (Buffer.compare(sourceBuffer, targetBuffer) === 0) {
      summary.unchanged += 1;
      return;
    }
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(sourcePath, targetPath);

  if (targetExists) {
    summary.updated += 1;
  } else {
    summary.created += 1;
  }
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const childFiles = await listFiles(fullPath);
      for (const childFile of childFiles) {
        files.push(path.join(entry.name, childFile));
      }
      continue;
    }

    if (entry.isFile()) {
      files.push(entry.name);
    }
  }

  return files.sort();
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function writeSummary(stdout, title, cwd, summary) {
  write(stdout, `${title} in ${cwd}`);
  write(stdout, `created: ${summary.created}`);
  write(stdout, `updated: ${summary.updated}`);
  write(stdout, `unchanged: ${summary.unchanged}`);
  write(stdout, `skipped: ${summary.skipped}`);

  if (summary.missing.length > 0) {
    write(stdout, `missing package files: ${summary.missing.join(", ")}`);
  }
}

function write(stdout, message) {
  stdout.write(`${message}\n`);
}

function helpText() {
  return [
    "AI Template CLI",
    "",
    "Usage:",
    "  ai-template init [--cwd <path>] [--force]",
    "  ai-template sync [--cwd <path>]",
    "  ai-template news",
    "",
    "Commands:",
    "  init   Install skills, rules, and model guidance into the project root.",
    "  sync   Update managed skills, rules, and model guidance from this package.",
    "  news   Print package news."
  ].join("\n");
}

module.exports = {
  copyManagedFiles,
  helpText,
  initEntries,
  main,
  parseArgs,
  run,
  syncEntries
};
