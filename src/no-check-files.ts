import { readFileSync, writeFileSync, readFile, writeFile } from 'fs';
import fg, { Options } from 'fast-glob';

export type IgnoreOptions = {
    // All non-output changing options from fast-glob
    [Prop in keyof Options 
        as Exclude<Prop, "objectMode" | "absolute" 
        | "markDirectories" | "onlyDirectories" 
        | "onlyFiles" | "stats" | "unique">]: Options[Prop];
} & {
    // If true, this will print ALL glob matches
    debugGlob?: boolean;
    // If true, this will print ALL files that are examined for ts-nocheck to be added
    debugTS?: boolean;
    // If true, this will report but will not actually write
    dryRun?: boolean;
};

const tsExtensionsRegex = /\.tsx?/i;
const tsNoCheckRegex = /^\s*\/\/\s*@ts-nocheck/i;

function isTSFile(filePath: string) {
    return filePath.match(tsExtensionsRegex);
}

function tsDebug(filePath: string | Buffer, options: IgnoreOptions) {
    if (options?.debugTS) {
        console.debug(`TS No-Check Match: ${filePath}`);
    }
}

function globDebug(filePath: string | Buffer, options: IgnoreOptions) {
    if (options?.debugGlob) {
        console.debug(`Glob Match: ${filePath}`);
    }
}

function tryAddIgnoreToFileSync(filePath: string, options: IgnoreOptions) {
    if (isTSFile(filePath)) {
        tsDebug(filePath, options);
        const file = readFileSync(filePath, { encoding: 'utf8' });
        if (!file.match(tsNoCheckRegex)) {
            console.log(`Writing @ts-nocheck to file ${filePath}`);
            if (!options.dryRun) {
                writeFileSync(filePath, `// @ts-nocheck\n// ^ Above line was added by ignore-bad-ts\n${file}`);
            }
        }
    }
}

async function tryAddIgnoreToFile(filePath: string, options: IgnoreOptions) : Promise<void> {
    if (isTSFile(filePath)) {
        tsDebug(filePath, options);
        const filePromise = new Promise<string>((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString('utf-8'));
                }
            });
        });
        const file = await filePromise;

        if (!file.match(tsNoCheckRegex)) {
            console.log(`Writing @ts-nocheck to file ${filePath}`);
            if (!options.dryRun) {
                const writePromise = new Promise<void>((resolve, reject) => {
                    writeFile(filePath, `// @ts-nocheck\n// ^ Above line was added by ignore-bad-ts\n${file}`, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                return writePromise;
            }
        }
    }
    return Promise.resolve();
}

const globOptions : Options = {
    onlyFiles: true,
    absolute: true,
};

const defaultOptions :Options = {
    cwd: './',
};

export function ignoreFilesSync(fileGlobs: string[], options = {} as IgnoreOptions) {
    const filePaths = fg.sync(fileGlobs, {
        ...defaultOptions,
        ...options,
        ...globOptions,
    });
    filePaths.forEach((filePath) => {
        globDebug(filePath, options);
        tryAddIgnoreToFileSync(filePath, options);
    })
}

export async function ignoreFiles(fileGlobs: string[], options = {} as IgnoreOptions) : Promise<void> {
    const filePathsStream = fg.stream(fileGlobs, {
        ...defaultOptions,
        ...options,
        ...globOptions,
    });
    const writePromises : Promise<void>[] = [];
    for await (const filePath of filePathsStream) {
        globDebug(filePath, options);
        writePromises.push(
            tryAddIgnoreToFile(Buffer.isBuffer(filePath) ? filePath.toString('utf-8') : filePath, options)
        );
    }

    await Promise.all(writePromises);
}
