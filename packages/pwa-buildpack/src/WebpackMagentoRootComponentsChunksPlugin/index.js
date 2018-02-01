const { isAbsolute, join } = require('path');
const { RawSource } = require('webpack-sources');
const { rootComponentMap } = require('./roots-chunk-loader');

const loaderPath = join(__dirname, 'roots-chunk-loader.js');

class WebpackMagentoRootComponentsChunksPlugin {
    constructor({ rootComponentsDirs, manifestFileName } = {}) {
        this.rootComponentsDirs = rootComponentsDirs || [
            './src/RootComponents'
        ];
        this.manifestFileName = manifestFileName || 'roots-manifest.json';
    }

    apply(compiler) {
        const { context } = compiler.options;
        const { rootComponentsDirs } = this;

        // Create a list of absolute paths for root components. When a
        // relative path is found, resolve it from the root context of
        // the webpack build
        const rootComponentsDirsAbs = rootComponentsDirs.map(
            dir => (isAbsolute(dir) ? dir : join(context, dir))
        );

        compiler.plugin('compilation', compilation => {
            compilation.plugin('normal-module-loader', (loaderContext, mod) => {
                // To create a unique chunk for each RootComponent, we want to inject
                // a dynamic import() for each RootComponent, within each entry point.
                const isAnEntry = compilation.entries.some(entryMod => {
                    // Check if the module being constructed matches a defined entry point
                    if (mod === entryMod) return true;
                    if (!entryMod.identifier().startsWith('multi')) {
                        return false;
                    }

                    // If a multi-module entry is used (webpack-dev-server creates one), we
                    // need to try and match against each dependency in the multi module
                    return entryMod.dependencies.some(
                        singleDep => singleDep.module === mod
                    );
                });
                if (!isAnEntry) return;

                // If this module is an entry module, inject a loader in the pipeline
                // that will force creation of all our RootComponent chunks
                mod.loaders.push({
                    loader: loaderPath,
                    options: {
                        rootsDirs: rootComponentsDirsAbs
                    }
                });
            });
        });

        compiler.plugin('emit', (compilation, cb) => {
            // Prepare the manifest that the Magento backend can use
            // to pick root components for a page.
            const namedChunks = Array.from(
                Object.values(compilation.namedChunks)
            );
            const manifest = namedChunks.reduce((acc, chunk) => {
                const rootDirective = rootComponentMap.get(chunk.name);
                if (!rootDirective) return acc;

                // Index 0 is always the chunk, but it's an Array because
                // there could be a source map (which we don't care about)
                const [rootComponentFilename] = chunk.files;
                acc[chunk.name] = Object.assign(
                    {
                        chunkName: rootComponentFilename,
                        chunkID: chunk.id
                    },
                    rootDirective
                );
                return acc;
            }, {});

            compilation.assets[this.manifestFileName] = new RawSource(
                JSON.stringify(manifest, null, 4)
            );
            cb();
        });
    }
}

module.exports = WebpackMagentoRootComponentsChunksPlugin;
