class IOAdapter {
    constructor(implementations) {
        const missingImpls = ['resolvePath', 'readFile', 'networkFetch'].reduce(
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
     * Works like Node `path.resolve`, but for the provided filesystem
     * implementation. (Injected for testability.)
     * @param {...string} segments Relative path segments to resolve into an absolute path.
     * @return {string} Resolved path;
     */
    resolvePath(...segments) {}

    /**
     * Works like promisified Node `fs.readFile`. (Injected for testability.)
     * @param {string} path Path of file to read.
     * @param {string} [charset] Character set, e.g. 'utf-8'.
     * @return {Promise<string|Buffer>} Promise for file contents.
     */
    async readFile(filePath, charset) {}

    /**
     * Works like `node-fetch`. (Injected for testability.)
     * @param {string|URL} URL URL to fetch.
     * @param {object} options Fetch options, see node-fetch docs.
     * @return {Promise<Response>}
     */
    async networkFetch(url, options) {}
}

module.exports = IOAdapter;
