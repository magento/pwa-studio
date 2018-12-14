const debug = require('debug')('upward-js:IOAdapter');
const containsPath = require('contains-path');
const { resolve, dirname } = require('path');
const fs = require('fs');
const { promisify } = require('util');
const stat = promisify(fs.stat);

class IOAdapter {
    static default(upwardPath) {
        debug(`creating default IO from ${upwardPath}`);
        const baseDir = dirname(upwardPath);
        debug(`baseDir ${baseDir}`);

        // prevent path traversal above baseDir
        const resolvePath = filePath => {
            const resolvedPath = resolve(baseDir, filePath);
            if (!containsPath(resolvedPath, baseDir)) {
                throw new Error(
                    `Cannot read ${resolvedPath} because it is outside ${baseDir}`
                );
            }
            return resolvedPath;
        };

        const fetch = require('node-fetch');
        return new IOAdapter({
            async createReadFileStream(filePath, encoding) {
                debug("DefaultIO.createReadStream('%s')", filePath);
                return fs.createReadStream(resolvePath(filePath), { encoding });
            },
            async getFileSize(filePath) {
                const { size } = await stat(resolvePath(filePath));
                return size;
            },
            async networkFetch(url, opts) {
                debug("DefaultIO.networkFetch('%s', %A)", url, opts);
                return fetch(url, opts);
            }
        });
    }
    constructor(implementations) {
        const missingImpls = [
            'createReadFileStream',
            'getFileSize',
            'networkFetch'
        ].reduce(
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
     * Works like Node `fs.createReadStream` but the Stream is wrapped in a
     * Promise. (Injected for testability.)
     * Cannot traverse below working directory.
     * @param {string} path Path of file to read.
     * @param {string} [encoding] Character set, e.g. 'utf-8'.
     * @return {ReadableStream} Stream of file contents.
     */
    // istanbul ignore next
    async createReadFileStream(filePath, encoding) {} //eslint-disable-line

    /**
     * Returns a Promise for an integer representing the size, in bytes, of the
     * file at `filePath`. Necessary for efficient caching of streamed
     * responses.
     * Cannot traverse below working directory.
     * @param {string} path Path of file to read.
     * @return {Promise<number>} Size in bytes of file.
     */
    // istanbul ignore next
    async getFileSize(filePath) {} //eslint-disable-line

    /**
     * Works like `node-fetch`. (Injected for testability.)
     * @param {string|URL} URL URL to fetch.
     * @param {object} options Fetch options, see node-fetch docs.
     * @return {Promise<Response>}
     */
    // istanbul ignore next
    async networkFetch(url, options) {} //eslint-disable-line
}

module.exports = IOAdapter;
