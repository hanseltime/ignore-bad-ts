import { ignoreFilesSync, ignoreFiles } from '../src/no-check-files';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function fixtureDir(testDir: string): string {
    return path.resolve(__dirname, 'fixtures', testDir);
}

function getFileMap(testDir: string) : { [key: string]: string } {
    const fixDir = fixtureDir(testDir);

    const file1Path = path.resolve(fixDir, 'node_modules/package1/file1.ts');
    const file2Path = path.resolve(fixDir, 'node_modules/package1/file2.ts')
    const file3Path = path.resolve(fixDir, 'node_modules/@scope/package2/file1.ts');
    const file4Path = path.resolve(fixDir, 'node_modules/@scope/package2/file2.ts');

    return {
        [file1Path]: readFileSync(file1Path).toString(),
        [file2Path]: readFileSync(file2Path).toString(),
        [file3Path]: readFileSync(file3Path).toString(),
        [file4Path]: readFileSync(file4Path).toString(),
    };
}

function assertIgnoreAddedToFileMap(origFileMap: { [key: string]: string }) : void {
    Object.keys(origFileMap).forEach((file) => {
        const content = readFileSync(file).toString();
        expect(readFileSync(file).toString()).toBe(`// @ts-nocheck\n// ^ Above line was added by ignore-bad-ts\n${origFileMap[file]}`);
    })
}

function assertFileMapUnchanged(origFileMap: { [key: string]: string }) : void {
    Object.keys(origFileMap).forEach((file) => {
        const content = readFileSync(file).toString();
        expect(readFileSync(file).toString()).toBe(origFileMap[file]);
    })
}

let origFileMap : { [key: string]: string }= {};
afterEach(() => {
    Object.keys(origFileMap).forEach((file) => {
        writeFileSync(file, origFileMap[file]);
    });
});

it('Writes ignore lines synchronously', () => {

    origFileMap = getFileMap('syncAdd');

    ignoreFilesSync(['node_modules/**'], {
        cwd: fixtureDir('syncAdd'),
    });

    assertIgnoreAddedToFileMap(origFileMap);

});

it('Writes ignore lines asynchronously', async () => {

    origFileMap = getFileMap('asyncAdd');

    await ignoreFiles(['node_modules/**'], {
        cwd: fixtureDir('asyncAdd'),
    });

    assertIgnoreAddedToFileMap(origFileMap);

});

it('Does not write asynchronously if ignore lines are present', async () => {

    origFileMap = getFileMap('asyncNoAdd');

    await ignoreFiles(['node_modules/**'], {
        cwd: fixtureDir('asyncNoAdd'),
    });

    assertFileMapUnchanged(origFileMap);

});

it('Does not write asynchronously if ignore lines are present', async () => {

    origFileMap = getFileMap('syncNoAdd');

    await ignoreFiles(['node_modules/**'], {
        cwd: fixtureDir('syncNoAdd'),
    });

    assertFileMapUnchanged(origFileMap);

});

it('Does not write asynchronously if dryRun', async () => {

    origFileMap = getFileMap('asyncAdd');

    await ignoreFiles(['node_modules/**'], {
        cwd: fixtureDir('asyncAdd'),
        dryRun: true,
    });

    assertFileMapUnchanged(origFileMap);

});

it('Does not write synchronously if dryRun', async () => {

    origFileMap = getFileMap('syncAdd');

    await ignoreFilesSync(['node_modules/**'], {
        cwd: fixtureDir('syncAdd'),
        dryRun: true,
    });

    assertFileMapUnchanged(origFileMap);

});
