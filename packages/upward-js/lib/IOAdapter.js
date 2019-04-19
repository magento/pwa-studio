const debug = require('debug')('upward-js:IOAdapter');
const containsPath = require('contains-path');
const { resolve, dirname } = require('path');
const { readFile: fsReadFile } = require('fs');
const { promisify } = require('util');

const readFile = promisify(fsReadFile);
class IOAdapter {
    static default(upwardPath) {
        debug(`creating default IO from ${upwardPath}`);
        const baseDir = dirname(upwardPath);
        debug(`baseDir ${baseDir}`);
        return new IOAdapter({
            networkFetch: require('node-fetch'),
            readFile: (filePath, enc) => {
                // prevent path traversal above baseDir
                const resolvedPath = resolve(baseDir, filePath);
                if (!containsPath(resolvedPath, baseDir)) {
                    throw new Error(
                        `Cannot read ${resolvedPath} because it is outside ${baseDir}`
                    );
                }
                return readFile(resolvedPath, enc);
            }
        });
    }
    constructor(implementations) {
        const missingImpls = ['readFile', 'networkFetch'].reduce(
            (missing, method) =>
                method in implementations
                    ? missing
                    : missing +
                      `Must provide an implementation of '${method}\n`,
            ''
        );
        if (missingImpls) {
            throw new Error(`Error creating IOAdapter:\n${missingImpls}`);
        }
        Object.assign(this, implementations);
    }
    /**
     * Works like promisified Node `fs.readFile`. (Injected for testability.)
     * Cannot traverse below working directory.
     * @param {string} path Path of file to read.
     * @param {string} [encoding] Character set, e.g. 'utf-8'.
     * @return {Promise<string|Buffer>} Promise for file contents.
     */
    async readFile(filePath, encoding) {} //eslint-disable-line

    /**
     * Works like `node-fetch`. (Injected for testability.)
     * @param {string|URL} URL URL to fetch.
     * @param {object} options Fetch options, see node-fetch docs.
     * @return {Promise<Response>}
     */
    async networkFetch(url, options) {} //eslint-disable-line
}

module.exports = IOAdapter;
