const { join } = require('path');
const virtualWebpack = require('../../__tests__/__helpers__/virtualWebpack');
const RootComponentsPlugin = require('../RootComponentsPlugin');

const fixture = require('../../../__tests__/__helpers__/getFixture');

const basic3PageProjectDir = fixture('basic-project-3-pages');
const basic1PageProjectDir = fixture('basic-project-1-page');

const compile = async config => {
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
    return virtualWebpack(config);
};

test('Creates a chunk for each root and a module to import them', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: {
            main: join(basic3PageProjectDir, 'src', 'index.js')
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
                    join(basic3PageProjectDir, 'src', 'RootComponents')
                ]
            })
        ]
    };

    const {
        stats: {
            compilation: { assets }
        },
        output
    } = await compile(config);
    expect(assets['RootCmp_catalog_page__default.chunk.js']).toBeTruthy();
    expect(assets['RootCmp_product_page__default.chunk.js']).toBeTruthy();
    expect(assets['RootCmp_product_page__special.chunk.js']).toBeTruthy();
    expect(output['dist/main.js']).toMatch(/fetchRootComponent\s*=/m);
    expect(output['dist/main.js']).toMatch(/RootCmp_product_page__default:/m);
});

test('Does not prevent chunk name from being configurable', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: {
            main: join(basic3PageProjectDir, 'src', 'index.js')
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
                    join(basic3PageProjectDir, 'src', 'RootComponents')
                ]
            })
        ]
    };

    const {
        stats: {
            compilation: { assets }
        }
    } = await compile(config);
    expect(assets['RootCmp_catalog_page__default.foobar.js']).toBeTruthy();
});

test('Creates chunks for all roots when multiple values are provided in "rootComponentsDirs" config', async () => {
    const config = {
        context: basic1PageProjectDir,
        entry: {
            main: join(basic1PageProjectDir, 'src', 'index.js')
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
                    join(basic3PageProjectDir, 'src', 'RootComponents'),
                    'RootComponents'
                ]
            })
        ]
    };

    const {
        stats: {
            compilation: { assets }
        }
    } = await compile(config);
    expect(assets['RootCmp_catalog_page__default.chunk.js']).toBeTruthy();
    expect(assets['RootCmp_cms_page__default.chunk.js']).toBeTruthy();
});

test('Works when there is 1 unnamed entry point in the config', async () => {
    const config = {
        context: basic3PageProjectDir,
        entry: join(basic3PageProjectDir, 'src', 'index.js'),
        output: {
            path: join(basic3PageProjectDir, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new RootComponentsPlugin({
                context: basic3PageProjectDir,
                rootComponentsDirs: [
                    join(basic3PageProjectDir, 'src', 'RootComponents')
                ]
            })
        ]
    };

    const {
        stats: {
            compilation: { assets }
        }
    } = await compile(config);
    expect(assets['RootCmp_catalog_page__default.chunk.js']).toBeTruthy();
    expect(assets['RootCmp_product_page__default.chunk.js']).toBeTruthy();
    expect(assets['RootCmp_product_page__special.chunk.js']).toBeTruthy();
    // default entry point name when name isn't provided
    expect(assets['main.js']).toBeTruthy();
});

test('Logs warning when RootComponent file has > 1 @RootComponent comment', async () => {
    const projectDir = fixture('dupe-root-component');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'src', 'index.js'),
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
    const projectDir = fixture('root-component-dep');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'src', 'index.js'),
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

    const { output } = await compile(config);
    expect(output['dist/RootCmp_product_page__default.chunk.js']).not.toContain(
        'Cannot find module'
    );
});

test('Logs warning if root component exists with no page types', async () => {
    const projectDir = fixture('missing-page-types');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'src', 'index.js'),
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
    const projectDir = fixture('no-root-components');
    const config = {
        context: projectDir,
        entry: join(projectDir, 'src', 'index.js'),
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
