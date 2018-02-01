const { join, sep, dirname } = require('path');
const { promisify: pify } = require('util');
const directiveParser = require('@magento/directive-parser');

/**
 * By design, this loader ignores the input content. The loader's sole purpose
 * is to dynamically generate import() expressions that tell webpack to create
 * chunks for each Root Component in a Magento theme
 */
module.exports = async function rootComponentsChunkLoader(src) {
    // Using `this.async()` because webpack's loader-runner lib has a super broken implementation
    // of promise support
    const cb = this.async();
    const readFile = pify(this.fs.readFile.bind(this.fs));

    try {
        const rootsDirs = this.query.rootsDirs;

        const readdir = pify(this.fs.readdir.bind(this.fs));
        const dirEntries = flatten(
            await Promise.all(
                rootsDirs.map(async dir => {
                    const dirs = await readdir(dir);
                    return dirs.map(d => join(dir, d));
                })
            )
        );

        const stat = pify(this.fs.stat.bind(this.fs));
        const dirs = await asyncFilter(dirEntries, async dir => {
            return (await stat(dir)).isDirectory();
        });

        const sources = await Promise.all(
            dirs.map(async dir => {
                const rootComponentPath = join(dir, 'index.js'); // index.js should probably be configurable
                // `this.loadModule` would typically be used here, but we can't  use it due to a bug
                // https://github.com/DrewML/webpack-loadmodule-bug. Instead, we do a read from webpack's MemoryFS.
                // The `toString` is necessary because webpack's implementation of the `fs` API doesn't respect the
                // encoding param, so the returned value is a Buffer. We don't actually _need_ `this.loadModule`,
                // since we're not running the source through a full ECMAScript parser (so we don't need the file post-loaders)
                const src = (await readFile(rootComponentPath)).toString();

                return {
                    rootComponentPath,
                    src
                };
            })
        );

        sources.forEach(({ rootComponentPath, src }) => {
            const { directives = [], errors } = directiveParser(src);
            if (errors.length) {
                console.warn(
                    `Found PWA Studio Directive warning in ${rootComponentPath}`
                );
            }
            const rootComponentDirectives = directives.filter(
                d => d.type === 'RootComponent'
            );

            if (rootComponentDirectives.length > 1) {
                console.warn(
                    `Found more than 1 RootComponent Directive in ${
                        rootComponentPath
                    }. Only the first will be used`
                );
            }

            // Because this error is reported from the loader, webpack CLI shows
            // the error happening within `placeholder.ext`, which is some unfortunate
            // indirection. TODO: Find a way to report the error for the correct module.
            // Likely involves passing the error back to `WebpackMagentoPageChunksPlugin`
            if (!rootComponentDirectives.length) {
                throw new Error(
                    `Failed to create chunk for the following file, because it is missing a @RootComponent directive: ${
                        rootComponentPath
                    }`
                );
            }

            rootComponentMap.set(
                chunkNameFromRootComponentDir(dirname(rootComponentPath)),
                rootComponentDirectives[0]
            );
        });

        const dynamicImportCalls = generateDynamicImportCode(dirs);
        const finalSrc = `${src};\n${dynamicImportCalls}`;
        // The entry point source now contains the code of the entry point +
        // a dynamic import() for each RootComponent
        cb(null, finalSrc);
    } catch (err) {
        cb(err);
    }
};

const rootComponentMap = (module.exports.rootComponentMap = new Map());

/**
 * @description webpack does not provide a programmatic API to create chunks for
 * n files. To get around this, we inject an (unused) function declaration in the entry point,
 * that wraps n number of import() calls. This will force webpack to create the chunks we need
 * for each RootComponent, but will allow UglifyJS to remove the wrapper function
 * (and the dynamic import calls) from the final bundle.
 * @param {string[]} dirs
 * @returns {string}
 */
function generateDynamicImportCode(dirs) {
    // TODO: Dig deeper for an API to programatically create chunks, because
    // generating strings of JS is far from ideal
    const dynamicImportsStr = dirs
        .map(dir => {
            const chunkName = chunkNameFromRootComponentDir(dir);
            // Right now, Root Components are assumed to always be the `index.js` inside of a
            // top-level dir in a specified root dir. We can change this to something else or
            // make it configurable later
            const fullPath = join(dir, 'index.js');
            return `import(/* webpackChunkName: "${chunkName}" */ '${
                fullPath
            }')`;
        })
        .join('\n\n');

    // Note: the __PURE__ comment ensures UglifyJS won't include
    // the unnecessary function in the output
    return `
        /*#__PURE__*/function this_function_will_be_removed_by_uglify() {
            ${dynamicImportsStr}
        }
    `;
}

/**
 *
 * @param {string} dir
 */
function chunkNameFromRootComponentDir(dir) {
    return dir.split(sep).slice(-1)[0];
}

/**
 * @template T
 * @param {T[]} array
 * @param {(item: T) => boolean} predicate
 * @returns {T[]}
 */
async function asyncFilter(array, predicate) {
    const results = await Promise.all(
        array.map((...args) => promiseBoolReflect(predicate(...args)))
    );

    return array.filter((_, i) => results[i]);
}

/**
 * @param {Promise<any>} promise
 * @returns {Promise<boolean>}
 */
async function promiseBoolReflect(promise) {
    try {
        return !!await promise;
    } catch (err) {
        return false;
    }
}

function flatten(arr) {
    return Array.prototype.concat(...arr);
}
