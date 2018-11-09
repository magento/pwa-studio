jest.mock('workbox-webpack-plugin');
jest.mock('write-file-webpack-plugin');

const WorkboxPlugin = require('workbox-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const ServiceWorkerPlugin = require('../ServiceWorkerPlugin');

test('throws if options are missing', () => {
    expect(() => new ServiceWorkerPlugin({})).toThrow(
        'env.mode must be of type string'
    );
    expect(
        () =>
            new ServiceWorkerPlugin({
                env: { mode: 'development' },
                serviceWorkerFileName: 'file.name'
            })
    ).toThrow('paths.output must be of type string');
});

test('returns a valid Webpack plugin', () => {
    expect(
        new ServiceWorkerPlugin({
            env: {
                mode: 'development'
            },
            serviceWorkerFileName: 'sw.js',
            runtimeCacheAssetPath: 'https://location/of/assets',
            paths: {
                output: 'path/to/assets'
            }
        })
    ).toHaveProperty('apply', expect.any(Function));
});

test('.apply calls WorkboxPlugin.GenerateSW in prod', () => {
    const plugin = new ServiceWorkerPlugin({
        env: {
            mode: 'production'
        },
        serviceWorkerFileName: 'sw.js',
        runtimeCacheAssetPath: 'https://location/of/assets',
        paths: {
            output: 'path/to/assets'
        }
    });
    const workboxApply = jest.fn();
    const fakeCompiler = {};
    WorkboxPlugin.GenerateSW.mockImplementationOnce(() => ({
        apply: workboxApply
    }));

    plugin.apply(fakeCompiler);

    expect(WriteFileWebpackPlugin).not.toHaveBeenCalled();
    expect(WorkboxPlugin.GenerateSW).toHaveBeenCalledWith(
        expect.objectContaining({
            globDirectory: 'path/to/assets',
            globPatterns: expect.arrayContaining([expect.any(String)]),
            swDest: 'sw.js'
        })
    );
    expect(workboxApply).toHaveBeenCalledWith(fakeCompiler);
});

test('.apply calls nothing but warns in console in dev', () => {
    const plugin = new ServiceWorkerPlugin({
        env: {
            mode: 'development'
        },
        serviceWorkerFileName: 'sw.js',
        runtimeCacheAssetPath: 'https://location/of/assets',
        paths: {
            output: 'path/to/assets'
        }
    });
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {});

    plugin.apply({});

    expect(WriteFileWebpackPlugin).not.toHaveBeenCalled();
    expect(WorkboxPlugin.GenerateSW).not.toHaveBeenCalled();

    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
            `Emitting no ServiceWorker in development mode.`
        )
    );

    console.warn.mockRestore();
});

test('.apply generates and writes out a serviceworker when enableServiceWorkerDebugging is set', () => {
    const plugin = new ServiceWorkerPlugin({
        env: {
            mode: 'development'
        },
        enableServiceWorkerDebugging: true,
        serviceWorkerFileName: 'sw.js',
        runtimeCacheAssetPath: 'https://location/of/assets',
        paths: {
            output: 'path/to/assets'
        }
    });

    const fakeCompiler = {};
    const workboxApply = jest.fn();
    const writeFileApply = jest.fn();
    WorkboxPlugin.GenerateSW.mockImplementationOnce(() => ({
        apply: workboxApply
    }));
    WriteFileWebpackPlugin.mockImplementationOnce(() => ({
        apply: writeFileApply
    }));

    plugin.apply(fakeCompiler);

    expect(WriteFileWebpackPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
            test: expect.objectContaining({
                source: 'sw.js$'
            })
        })
    );

    expect(writeFileApply).toHaveBeenCalledWith(fakeCompiler);

    expect(WorkboxPlugin.GenerateSW).toHaveBeenCalledWith(
        expect.objectContaining({
            globDirectory: 'path/to/assets',
            globPatterns: expect.arrayContaining([expect.any(String)]),
            swDest: 'sw.js'
        })
    );
});

test('.apply uses `InjectManifest` when `injectManifest` is `true`', () => {
    const injectManifestConfig = {
        swSrc: 'path/to/sw',
        swDest: 'path/to/dest'
    };
    const plugin = new ServiceWorkerPlugin({
        env: {
            mode: 'development'
        },
        enableServiceWorkerDebugging: true,
        serviceWorkerFileName: 'sw.js',
        injectManifest: true,
        paths: {
            output: 'path/to/assets'
        },
        injectManifestConfig
    });

    const fakeCompiler = {};
    const workboxApply = jest.fn();
    WorkboxPlugin.InjectManifest.mockImplementationOnce(() => ({
        apply: workboxApply
    }));

    plugin.apply(fakeCompiler);

    expect(WorkboxPlugin.InjectManifest).toHaveBeenCalledWith(
        expect.objectContaining(injectManifestConfig)
    );
});
