#!/usr/bin/env node

"use strict";

const { main } = require("../src/cli");

main(process.argv.slice(2)).catch((error) => {
  const message = error && error.message ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = error && Number.isInteger(error.exitCode) ? error.exitCode : 1;
});
