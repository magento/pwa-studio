const { isAbsolute, join, extname } = require('path');
const { RawSource } = require('webpack-sources');
const {
    rootComponentMap,
    seenRootComponents
} = require('./roots-chunk-loader');

const loaderPath = join(__dirname, 'roots-chunk-loader.js');

const isJsFile = filepath => /\.jsx?/.test(extname(filepath));

/**
 * @description webpack plugin that creates chunks for each
 * individual RootComponent in a store, and generates a manifest
 * with data for consumption by the backend.
 */
class MagentoRootComponentsPlugin {
    /**
     * @param {object} opts
     * @param {string[]} opts.rootComponentsDirs All directories to be searched for RootComponents
     * @param {string} opts.manifestFileName Name of the manifest file to be emitted from the build
     */
    constructor(opts = {}) {
        const { rootComponentsDirs, manifestFileName } = opts;
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

        const moduleByPath = new Map();
        compiler.hooks.compilation.tap(
            'MagentoRootComponentsPlugin',
            compilation => {
                compilation.hooks.normalModuleLoader.tap(
                    'MagentoRootComponentsPlugin',
                    (loaderContext, mod) => {
                if (!isJsFile(mod.resource)) {
                    return;
                }
                if (seenRootComponents.has(mod.resource)) {
                    // The module ("mod") has not been assigned an ID yet,
                    // so we need to keep a reference to it which will allow
                    // us to grab the ID during the emit phase
                    moduleByPath.set(mod.resource, mod);
                }
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
                    }
                });
                );
            }
        );

        compiler.hooks.emit.tap('MagentoRootComponentsPlugin', compilation => {
            // Prepare the manifest that the Magento backend can use
            // to pick root components for a page.
            const chunks = Array.from(compilation.chunks);

            const manifest = chunks.reduce((acc, chunk) => {
                const { rootDirective, rootComponentPath } =
                    rootComponentMap.get(chunk.name) || {};
                if (!rootDirective) return acc;

                // Index 0 is always the chunk, but it's an Array because
                // there could be a source map (which we don't care about)
                const [rootComponentFilename] = chunk.files;
                acc[chunk.name] = Object.assign(
                    {
                        chunkName: rootComponentFilename,
                        rootChunkID: chunk.id,
                        rootModuleID: moduleByPath.get(rootComponentPath).id
                    },
                    rootDirective
                );
                return acc;
            }, {});

            compilation.assets[this.manifestFileName] = new RawSource(
                JSON.stringify(manifest, null, 4)
            );
        });
    }
}

module.exports = MagentoRootComponentsPlugin;
