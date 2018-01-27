const assert = require('assert');
const { isAbsolute, join } = require('path');
const { RawSource } = require('webpack-sources');
const { rootComponentMap } = require('./roots-chunk-loader');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

const loaderPath = join(__dirname, 'roots-chunk-loader.js');
const placeholderPath = join(__dirname, 'placeholder.ext');

class WebpackMagentoRootComponentsChunksPlugin {
    static get ENTRY_NAME() {
        return '__magento_page_roots__';
    }

    constructor({ rootComponentsDirs, manifestFileName } = {}) {
        this.rootComponentsDirs = rootComponentsDirs || [
            './src/RootComponents'
        ];
        this.manifestFileName = manifestFileName || 'roots-manifest.json';
    }

    apply(compiler) {
        const { ENTRY_NAME } = WebpackMagentoRootComponentsChunksPlugin;
        const { context } = compiler.options;
        const { rootComponentsDirs } = this;

        const rootComponentsDirsAbs = rootComponentsDirs.map(
            dir => (isAbsolute(dir) ? dir : join(context, dir))
        );

        // This is a trick to force webpack into reading a dynamic file from memory,
        // instead of from disk. We point it at our loader with a dummy file, and
        // the loader will return the code we want webpack to parse
        const entryPath = `${loaderPath}?rootsDirs=${rootComponentsDirsAbs.join(
            '|'
        )}!${placeholderPath}`;
        compiler.apply(new SingleEntryPlugin(context, entryPath, ENTRY_NAME));

        compiler.plugin('emit', (compilation, cb) => {
            const trickEntryPoint = compilation.chunks.find(
                chunk => chunk.name === ENTRY_NAME
            );
            assert(
                trickEntryPoint,
                `WebpackMagentoRootComponentsChunksPlugin could not find the "${
                    ENTRY_NAME
                }" entry chunk`
            );

            // Prepare the manifest that the Magento backend can use
            // to pick root components for a page.
            const manifest = trickEntryPoint.chunks.reduce((acc, chunk) => {
                const rootDirective = rootComponentMap.get(chunk.name);
                const [rootComponentFilename] = chunk.files; // No idea why `files` is an array here 🤔

                acc[chunk.name] = Object.assign(
                    { chunkName: rootComponentFilename },
                    rootDirective
                );
                return acc;
            }, {});

            // Remove the asset + sourcemap for our trick entry point that contained the `import()`
            // expressions, before it is written to disk. Its chunks have already been created
            trickEntryPoint.files.forEach(file => {
                delete compilation.assets[file];
            });

            compilation.assets[this.manifestFileName] = new RawSource(
                JSON.stringify(manifest, null, 4)
            );
            cb();
        });
    }
}

module.exports = WebpackMagentoRootComponentsChunksPlugin;
