const { join, sep } = require('path');
const loaderUtils = require('loader-utils');
const { promisify: pify } = require('util');

/**
 * By design, this loader ignores the input content. The loader's sole purpose
 * is to dynamically generate import() expressions that tell webpack to create
 * chunks for each Root Component in a Magento theme
 */
module.exports = async function rootComponentsChunkLoader(/*ignored*/) {
    const cb = this.async();
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

    cb(null, generateDynamicChunkEntry(dirs));
};

/**
 * @param {string[]} dirs
 * @returns {string}
 */
function generateDynamicChunkEntry(dirs) {
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
