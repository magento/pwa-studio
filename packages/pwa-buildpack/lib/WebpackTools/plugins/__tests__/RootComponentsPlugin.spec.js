const { join } = require('path');
const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const RootComponentsPlugin = require('../RootComponentsPlugin');

const basic3PageProjectDir = join(
    __dirname,
    '__fixtures__/basic-project-3-pages'
);
const basic1PageProjectDir = join(
    __dirname,
    '__fixtures__/basic-project-1-page'
);

const compile = config =>
    new Promise((resolve, reject) => {
        config.mode = 'production';
        config.optimization = config.optimization || {};
        config.optimization.minimize = false;
        config.optimization.splitChunks = {
            minSize: 1,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    reuseExistingChunk: false
                }
            }
        };
        const fs = new MemoryFS();
        const compiler = webpack(config);
        compiler.outputFileSystem = fs;

        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                reject(new Error(err || stats.toString()));
            } else {
                resolve({ fs, stats });
            }
        });
    });

test('Creates a chunk for each root when multiple roots exist', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: {
            main: join(basic3PageProjectDir, 'entry.js')
        },
        output: {
            path: join(basic3PageProjectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(
        stats.compilation.assets['RootCmp_catalog_page__default.chunk.js']
    ).toBeTruthy();
    expect(
        stats.compilation.assets['RootCmp_product_page__default.chunk.js']
    ).toBeTruthy();
    expect(
        stats.compilation.assets['RootCmp_product_page__special.chunk.js']
    ).toBeTruthy();
});

test('Does not prevent chunk name from being configurable', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: {
            main: join(basic3PageProjectDir, 'entry.js')
        },
        output: {
            path: join(basic3PageProjectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].foobar.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(
        stats.compilation.assets['RootCmp_catalog_page__default.foobar.js']
    ).toBeTruthy();
});

test('Creates chunks for all roots when multiple values are provided in "rootComponentsDirs" config', async () => {
    const config = {
        context: basic1PageProjectDir,
        entry: {
            main: join(basic1PageProjectDir, 'entry.js')
        },
        output: {
            path: join(basic1PageProjectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: basic1PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents'),
                    'RootComponents'
                ]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(
        stats.compilation.assets['RootCmp_catalog_page__default.chunk.js']
    ).toBeTruthy();
    expect(
        stats.compilation.assets['RootCmp_cms_page__default.chunk.js']
    ).toBeTruthy();
});

test('Works when there is 1 unnamed entry point in the config', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: join(basic3PageProjectDir, 'entry.js'),
        output: {
            path: join(basic3PageProjectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { fs } = await compile(config);
    const expectedFiles = [
        'RootCmp_catalog_page__default.chunk.js',
        'RootCmp_product_page__default.chunk.js',
        'RootCmp_product_page__special.chunk.js',
        'main.js' // default entry point name when name isn't provided
    ].sort();
    const writtenFiles = fs.readdirSync(config.output.path).sort();
    expect(writtenFiles).toEqual(expectedFiles);
});

test('Logs warning when RootComponent file has > 1 @RootComponent comment', async () => {
    const projectDir = join(__dirname, '__fixtures__/dupe-root-component');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'entry.js'),
        output: {
            path: join(projectDir, 'dist'),
            filename: '[name].js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: projectDir,
                rootComponentsDirs: [join(projectDir, 'RootComponents')]
            })
        ]
    };

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    await compile(config);
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/Found more than 1 RootComponent Directive/)
    );
    console.warn.mockRestore();
});

test('Can resolve dependencies of a RootComponent', async () => {
    // https://github.com/DrewML/webpack-loadmodule-bug
    const projectDir = join(__dirname, '__fixtures__/root-component-dep');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'entry.js'),
        output: {
            path: join(projectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: projectDir,
                rootComponentsDirs: [join(projectDir, 'RootComponents')]
            })
        ]
    };

    const { fs } = await compile(config);
    const chunkStr = fs.readFileSync(
        join(projectDir, 'dist/RootCmp_product_page__default.chunk.js'),
        'utf8'
    );
    expect(chunkStr).not.toContain('Cannot find module');
});

test('Logs warning if root component exists with no page types', async () => {
    const projectDir = join(__dirname, '__fixtures__/missing-page-types');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'entry.js'),
        output: {
            path: join(projectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: projectDir,
                rootComponentsDirs: [join(projectDir, 'RootComponents')]
            })
        ]
    };

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    await compile(config);
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/RootComponent will never be used/)
    );
    console.warn.mockRestore();
});

test('Throws exception if no RootComponents exist in project', async () => {
    const projectDir = join(__dirname, '__fixtures__/no-root-components');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'entry.js'),
        output: {
            path: join(projectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: projectDir,
                rootComponentsDirs: [join(projectDir, 'RootComponents')]
            })
        ]
    };

    await expect(compile(config)).rejects.toThrow(/No RootComponents/);
});
