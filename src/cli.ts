#!/usr/bin/env node
import { Command } from 'commander';
import { ignoreFiles, IgnoreOptions } from './no-check-files';

const program = new Command();

program.version('0.1.0')
    .option('--debugGlob', 'Display all files matching the globs provided', false)
    .option('--debugTS', 'Display all files that would have @ts-nocheck added', false)
    .option('--dry-run', 'Does not actually write to the files.  Useful for debugging.', false);

program.parse(process.argv);

// All args are expected to be globs
if (program.args.length == 0) {
    console.error('Must provide at least one glob to ignore');
}
const options = program.opts() as IgnoreOptions;
ignoreFiles(program.args, options).then(() => { 
    if (options.dryRun) {
        console.log('Finished dry run for ignoring ts files.');
    } else {
        console.log('Finished adding ignore checks to unignored files.');
    }
});
