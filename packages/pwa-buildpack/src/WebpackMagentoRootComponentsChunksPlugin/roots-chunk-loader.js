const { join, sep } = require('path');
const loaderUtils = require('loader-utils');
const { promisify: pify } = require('util');
const directiveParser = require('@magento/directive-parser');

/**
 * By design, this loader ignores the input content. The loader's sole purpose
 * is to dynamically generate import() expressions that tell webpack to create
 * chunks for each Root Component in a Magento theme
 */
module.exports = async function rootComponentsChunkLoader(/*ignored*/) {
    // Using `this.async()` because webpack's loader-runner lib has a super broken implementation
    // of promise support
    const cb = this.async();

    try {
        const rootsDirs = loaderUtils.getOptions(this).rootsDirs.split('|');

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
                const [src, , mod] = await pifyMultipleArgs(
                    this.loadModule.bind(this)
                )(rootComponentPath);

                return {
                    rootComponentPath,
                    src,
                    mod
                };
            })
        );

        sources.forEach(({ rootComponentPath, src, mod }) => {
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

            rootComponentMap.set(mod, rootComponentDirectives[0]);
        });

        cb(null, generateDynamicChunkEntry(dirs));
    } catch (err) {
        cb(err);
    }
};

const rootComponentMap = (module.exports.rootComponentMap = new WeakMap());

/**
 * @param {string[]} dirs
 * @returns {string}
 */
function generateDynamicChunkEntry(dirs) {
    // TODO: Dig deeper for an API to programatically create chunks, because
    // generating strings of JS is far from ideal
    return dirs
        .map(dir => {
            const chunkName = dir.split(sep).slice(-1);
            // Right now, Root Components are assumed to always be the `index.js` inside of a
            // top-level dir in a specified root dir. We can change this to something else or
            // make it configurable later
            const fullPath = join(dir, 'index.js');
            return `import(/* webpackChunkName: "${chunkName}" */ '${
                fullPath
            }')`;
        })
        .join('\n\n');
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

function pifyMultipleArgs(fn) {
    return function(...args) {
        return new Promise((res, rej) => {
            args.push((err, ...cbArgs) => {
                if (err) rej(err);
                else res(cbArgs);
            });
            fn.apply(this, args);
        });
    };
}
