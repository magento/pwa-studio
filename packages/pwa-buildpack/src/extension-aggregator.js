const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { promisify: pify } = require('util');

/**
 * @param {object} options
 * @param {string} options.extensionsRoot
 * @returns {Promise<{root: string, config: Object}>[]}
 */
module.exports = async function extensionAggregator(options = {}) {
    const { extensionsRoot } = options;
    assertExtensionsRoot(extensionsRoot);

    const dirEntries = await pify(fs.readdir)(extensionsRoot);
    const stats = await Promise.all(
        dirEntries.map(async relpath => {
            const abs = path.join(extensionsRoot, relpath);
            const stat = await pify(fs.stat)(abs);
            return { filepath: abs, isDir: stat.isDirectory() };
        })
    );

    return stats.reduce((acc, stat) => {
        if (stat.isDir)
            acc.push({
                root: stat.filepath,
                config: require(path.join(stat.filepath, 'extension.json'))
            });
        return acc;
    }, []);
};

/**
 * @param {object} options
 * @param {string} options.extensionsRoot
 * @returns {{root: string, config: Object}[]}
 */
module.exports.sync = function extensionAggregatorSync(options = {}) {
    const { extensionsRoot } = options;
    assertExtensionsRoot(extensionsRoot);

    const dirEntries = fs.readdirSync(extensionsRoot);
    return dirEntries.reduce((acc, relpath) => {
        const abs = path.join(extensionsRoot, relpath);
        const isDir = fs.statSync(abs).isDirectory();
        if (isDir)
            acc.push({
                root: abs,
                config: require(path.join(abs, 'extension.json'))
            });
        return acc;
    }, []);
};

/**
 * @param {string} root
 */
function assertExtensionsRoot(root) {
    assert(typeof root === 'string', '"extensionsRoot" must be a string');
    assert(
        path.isAbsolute(root || ''),
        '"extensionsRoot" must be an absolute path'
    );
}
