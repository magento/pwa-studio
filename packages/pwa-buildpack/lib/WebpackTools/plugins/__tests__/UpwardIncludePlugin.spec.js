const { join } = require('path');
const virtualWebpack = require('../../__tests__/__helpers__/virtualWebpack');
const jsYaml = require('js-yaml');
const UpwardIncludePlugin = require('../UpwardIncludePlugin');

const fixture = require('../../../__tests__/__helpers__/getFixture');

const basic3PageProjectDir = fixture('basic-project-3-pages');
const basic1PageProjectDir = fixture('basic-project-1-page');

const missingUpwardFileDir = fixture('dupe-root-componentA;');
const badUpwardFileDir = fixture('missing-page-types');

test('merges upward files and resources', async () => {
    const config = {
        mode: 'production',
        context: basic1PageProjectDir,
        entry: {
            main: join(basic1PageProjectDir, 'src', 'index.js')
        },
        output: {
            path: join(basic1PageProjectDir, 'dist')
        },
        plugins: [
            new UpwardIncludePlugin({
                upwardDirs: [basic3PageProjectDir, basic1PageProjectDir]
            })
        ]
    };
    const {
        stats: {
            compilation: { assets }
        }
    } = await virtualWebpack(config);
    expect(assets['upward.yml']).toBeTruthy();
    expect(jsYaml.safeLoad(assets['upward.yml'].source())).toMatchObject({
        nothing: './nothing.json',
        basicProject1Page: 'foo',
        nonexistentFile: './unknown.pif',
        status: 200
    });

    expect(assets['nothing.json']).toBeTruthy();
    expect(JSON.parse(assets['nothing.json'].source())).toMatchObject({
        nothing: 'to see here'
    });

    expect(assets['robots.txt']).toBeTruthy();
    expect(assets['robots.txt'].source().toString()).toMatch(/Deny/);

    expect(assets).not.toHaveProperty('unknown.pif');
});

test('handles missing upward file', async () => {
    const config = {
        mode: 'production',
        context: missingUpwardFileDir,
        entry: {
            main: join(missingUpwardFileDir, 'src', 'index.js')
        },
        output: {
            path: join(missingUpwardFileDir, 'dist')
        },
        plugins: [
            new UpwardIncludePlugin({
                upwardDirs: [missingUpwardFileDir]
            })
        ]
    };

    await expect(virtualWebpack(config)).rejects.toThrow(/unable to read file/);
});

test('handles bad upward file', async () => {
    const config = {
        mode: 'production',
        context: badUpwardFileDir,
        entry: {
            main: join(badUpwardFileDir, 'src', 'index.js')
        },
        output: {
            path: join(badUpwardFileDir, 'dist')
        },
        plugins: [
            new UpwardIncludePlugin({
                upwardDirs: [badUpwardFileDir]
            })
        ]
    };

    await expect(virtualWebpack(config)).rejects.toThrow(/error parsing/);
});
