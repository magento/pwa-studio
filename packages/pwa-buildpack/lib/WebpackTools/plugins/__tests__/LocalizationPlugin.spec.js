const { join } = require('path');
const MemoryFS = require('memory-fs');
const vm = require('vm');
const webpack = require('webpack');
const LocalizationPlugin = require('../LocalizationPlugin');
const VirtualModulesPlugin = require('webpack-virtual-modules');

const virtualModules = new VirtualModulesPlugin();

const singleLocaleMultipleModules = join(
    __dirname,
    '__fixtures__/single-locale-multiple-modules'
);

const multipleLocalesMultipleModules = join(
    __dirname,
    '__fixtures__/multiple-locales-multiple-modules'
);

const noLocaleSingleModule = join(
    __dirname,
    '__fixtures__/no-locale-single-module'
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

const evalSource = source => {
    const webpackJsonp = [];
    const vmContext = {
        window: {
            webpackJsonp
        }
    };
    vm.runInNewContext(source, vmContext);

    const webpackModule = {
        exports: ''
    };

    // Run the module output
    const jsonOutput = webpackJsonp[0][1];
    jsonOutput[Object.keys(jsonOutput)[0]](webpackModule);

    return webpackModule.exports;
};

test('Creates i18n chunk from multiple modules containing single language with context overrides', async () => {
    const context = join(singleLocaleMultipleModules, 'Context');

    const dirs = [
        join(singleLocaleMultipleModules, 'Module1'),
        join(singleLocaleMultipleModules, 'Module2'),
        context
    ];

    const config = {
        context: singleLocaleMultipleModules,
        entry: {
            main: join(singleLocaleMultipleModules, 'entry.js')
        },
        output: {
            path: join(singleLocaleMultipleModules, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new LocalizationPlugin({
                virtualModules,
                context,
                dirs
            }),
            virtualModules
        ]
    };

    const { stats } = await compile(config);

    expect(stats.compilation.assets['i18n-en_US.chunk.js']).toBeTruthy();

    const output = evalSource(
        stats.compilation.assets['i18n-en_US.chunk.js'].source()
    );

    expect(output).toEqual({
        'Module 1 English': 'Module 1 English',
        'Module 1 Override': 'Context Override',
        'Module 2 English': 'Module 2 English',
        'Context English': 'Context English'
    });
});

test('Creates multiple i18n chunks from multiple modules containing multiple locales with context overrides', async () => {
    const context = join(multipleLocalesMultipleModules, 'Context');

    const dirs = [
        join(multipleLocalesMultipleModules, 'Module1'),
        join(multipleLocalesMultipleModules, 'Module2'),
        context
    ];

    const config = {
        context: multipleLocalesMultipleModules,
        entry: {
            main: join(multipleLocalesMultipleModules, 'entry.js')
        },
        output: {
            path: join(multipleLocalesMultipleModules, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new LocalizationPlugin({
                virtualModules,
                context,
                dirs
            }),
            virtualModules
        ]
    };

    const { stats } = await compile(config);

    // Expect translations from all 3 modules to be merged
    expect(stats.compilation.assets['i18n-en_US.chunk.js']).toBeTruthy();
    expect(stats.compilation.assets['i18n-fr_FR.chunk.js']).toBeTruthy();

    // Expect translations in single module to be present
    expect(stats.compilation.assets['i18n-de_DE.chunk.js']).toBeTruthy();

    const enUsOutput = evalSource(
        stats.compilation.assets['i18n-en_US.chunk.js'].source()
    );
    expect(enUsOutput).toEqual({
        'Module 1 English': 'Module 1 English',
        'Module 1 Override': 'Context Override',
        'Module 2 English': 'Module 2 English',
        'Context English': 'Context English'
    });

    const frFrOutput = evalSource(
        stats.compilation.assets['i18n-fr_FR.chunk.js'].source()
    );
    expect(frFrOutput).toEqual({
        'Module 1 French': 'Module 1 French',
        'Module 2 French': 'Module 2 French',
        'Context Override': 'Overridden in Context French',
        'Context French': 'Context French'
    });

    const deDeOutput = evalSource(
        stats.compilation.assets['i18n-de_DE.chunk.js'].source()
    );
    expect(deDeOutput).toEqual({
        German: 'German Translation'
    });
});

test('Throws error on missing i18n directory within module provided to plugin', async () => {
    const context = join(noLocaleSingleModule, 'Context');

    const dirs = [join(noLocaleSingleModule, 'Module1'), context];

    const config = {
        context: noLocaleSingleModule,
        entry: {
            main: join(noLocaleSingleModule, 'entry.js')
        },
        output: {
            path: join(noLocaleSingleModule, 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new LocalizationPlugin({
                virtualModules,
                context,
                dirs
            }),
            virtualModules
        ]
    };

    await expect(compile(config)).rejects.toThrow(
        /module has i18n special flag, but i18n directory does not exist at/
    );
});
