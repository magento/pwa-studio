const { join } = require('path');
const MemoryFS = require('memory-fs');
const { promisify: pify } = require('util');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const makeMagentoRootComponentsPlugin = require('..');

const basic3PageProjectDir = join(
    __dirname,
    '__fixtures__/basic-project-3-pages'
);
const basic1PageProjectDir = join(
    __dirname,
    '__fixtures__/basic-project-1-page'
);

const compile = async config => {
    config.mode = 'production';
    config.optimization = config.optimization || {};
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

    return {
        fs,
        stats: await pify(compiler.run.bind(compiler))()
    };
};

test.skip('Creates a chunk for each root when multiple roots exist', async () => {
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
            await makeMagentoRootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(stats.compilation.assets['Page1.chunk.js']).toBeTruthy();
    expect(stats.compilation.assets['Page2.chunk.js']).toBeTruthy();
    expect(stats.compilation.assets['Page3.chunk.js']).toBeTruthy();
});

test.skip('Does not prevent chunk name from being configurable', async () => {
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
            await makeMagentoRootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(stats.compilation.assets['Page1.foobar.js']).toBeTruthy();
});

test.skip('Creates chunks for all roots when multiple values are provided in "rootComponentsDirs" config', async () => {
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
            await makeMagentoRootComponentsPlugin({
                context: basic1PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents'),
                    join(basic1PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(stats.compilation.assets['Page1.chunk.js']).toBeTruthy();
    expect(stats.compilation.assets['SomePage.chunk.js']).toBeTruthy();
});

test.skip('Works when there is 1 unnamed entry point in the config', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: join(basic3PageProjectDir, 'entry.js'),
        output: {
            path: join(basic3PageProjectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            await makeMagentoRootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'RootComponents')
                ]
            })
        ]
    };

    const { fs } = await compile(config);
    const expectedFiles = [
        'Page1.chunk.js',
        'Page2.chunk.js',
        'Page3.chunk.js',
        'main.js', // default entry point name when name isn't provided
        'manifest.json'
    ].sort();
    const writtenFiles = fs.readdirSync(config.output.path).sort();
    expect(writtenFiles).toEqual(expectedFiles);
});

test.skip('Logs warning when RootComponent file has > 1 @RootComponent comment', async () => {
    const projectDir = join(__dirname, '__fixtures__/dupe-root-component');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'entry.js'),
        output: {
            path: join(projectDir, 'dist'),
            filename: '[name].js'
        },
        plugins: [
            await makeMagentoRootComponentsPlugin({
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

test.skip('Build fails when no @RootComponent directive is found', async () => {
    const projectDir = join(__dirname, '__fixtures__/missing-root-directive');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'entry.js'),
        output: {
            path: join(projectDir, 'dist'),
            filename: '[name].js'
        },
        plugins: [
            await makeMagentoRootComponentsPlugin({
                context: projectDir,
                rootComponentsDirs: [join(projectDir, 'RootComponents')]
            })
        ]
    };

    const { stats } = await compile(config);
    expect(stats.compilation.errors.length).toBe(1);
    const [firstError] = stats.compilation.errors;
    expect(firstError.message).toMatch(
        /Failed to create chunk for the following file, because it is missing a @RootComponent directive/
    );
});

test.skip('Can resolve dependencies of a RootComponent', async () => {
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
            await makeMagentoRootComponentsPlugin({
                context: projectDir,
                rootComponentsDirs: [join(projectDir, 'RootComponents')]
            })
        ]
    };

    const { fs } = await compile(config);
    const chunkStr = fs.readFileSync(
        join(projectDir, 'dist/Page1.chunk.js'),
        'utf8'
    );
    expect(chunkStr).not.toContain('Cannot find module');
});

test.skip('Uglify compiles out dynamic imports injected into entry point', async () => {
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
            await makeMagentoRootComponentsPlugin({
                context: basic1PageProjectDir,
                rootComponentsDirs: [
                    join(basic1PageProjectDir, 'RootComponents')
                ]
            })
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        ecma: 8,
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            drop_console: true
                        },
                        output: {
                            ecma: 7,
                            semicolons: false
                        },
                        keep_fnames: true
                    }
                })
            ]
        }
    };

    const { fs } = await compile(config);
    const entryPointSrc = fs.readFileSync(
        join(config.output.path, 'main.js'),
        'utf8'
    );
    expect(entryPointSrc).not.toContain('import()');
    expect(entryPointSrc).not.toContain(
        'this_function_will_be_removed_by_uglify'
    );
});
