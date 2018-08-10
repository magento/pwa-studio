const { isAbsolute, join } = require('path');
const { RawSource } = require('webpack-sources');
const {
    rootComponentMap,
    seenRootComponents
} = require('./roots-chunk-loader');

const loaderPath = join(__dirname, 'roots-chunk-loader.js');

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
        const { rootComponentsDirs, manifestFileName, phase } = opts;
        this.rootComponentsDirs = rootComponentsDirs || [
            './src/RootComponents'
        ];
        this.manifestFileName = manifestFileName || 'roots-manifest.json';
        this.phase = phase;
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
        compiler.plugin('compilation', compilation => {
            compilation.plugin('normal-module-loader', (loaderContext, mod) => {
                if (seenRootComponents.has(mod.resource)) {
                    // The module ("mod") has not been assigned an ID yet,
                    // so we need to keep a reference to it which will allow
                    // us to grab the ID during the emit phase
                    moduleByPath.set(mod.resource, mod);
                }

                // To create a unique chunk for each RootComponent, we want to inject
                // a dynamic import() for each RootComponent, within each entry point.

                // But identifying entry points is hard!

                // Top-level modules injected by a downstream "issuer" are not
                // entry points.
                let isEntrySimpleTest = mod => !mod.issuer;
                if (this.phase === 'development') {
                    // Unless we're in development mode. In that case,
                    // the best we can do is test if the entry is in node_modules.
                    isEntrySimpleTest = mod => mod.resource.indexOf('/node_modules/') !== -1;
                }

                const isAnEntry =
                    isEntrySimpleTest(mod) &&
                    // Otherwise, check if the module being constructed matches a defined entry point
                    compilation.entries.some(entryMod => {
                        if (mod === entryMod) {
                            return true;
                        }
                        if (!entryMod.identifier().startsWith('multi')) {
                            return false;
                        }
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
            cb();
        });
    }
}

module.exports = MagentoRootComponentsPlugin;
