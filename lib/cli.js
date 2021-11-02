#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var no_check_files_1 = require("./no-check-files");
var program = new commander_1.Command();
program.version('0.1.0')
    .option('--debugGlob', 'Display all files matching the globs provided', false)
    .option('--debugTS', 'Display all files that would have @ts-nocheck added', false);
program.parse(process.argv);
// All args are expected to be globs
if (program.args.length == 0) {
    console.error('Must provide at least one glob to ignore');
}
(0, no_check_files_1.ignoreFiles)(program.args, program.opts()).then(function () { console.log('Finished adding ignore checks to unignored files.'); });
