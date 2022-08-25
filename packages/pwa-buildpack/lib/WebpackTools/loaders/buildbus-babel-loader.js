/**
 * Custom babel-loader to enable warning reporting from Babel plugins.
 * This is a thin wrapper around `babel-loader` that works exactly the same as
 * `babel-loader` otherwise.
 */
const { inspect } = require('util');
const babelLoader = require('babel-loader');

function buildBusBabelLoader(content) {
    /**
     * Parse metadata sent from Babel plugin and log with Webpack logger.
     * @param {(Array|string)} data - Either a string message, or a 2-item
     * array of a message and a metadata object to inspect and display.
     */
    const logMeta = data => {
        let description = data;
        let meta;
        if (Array.isArray(data)) {
            [description, meta] = data;
        }
        const message = meta ? `${description}: ${inspect(meta)}` : description;
        this.emitWarning(new Error(message));
    };
    return babelLoader
        .custom(() => {
            return {
                result(res) {
                    /**
                     * Babel plugins that want to use this feature can add
                     * items to a `this.file.metadata` array and they will be
                     * logged after Babel has finished processing the file.
                     * file.
                     */
                    if (res.metadata.warnings) {
                        res.metadata.warnings.forEach(logMeta);
                    }
                    return res;
                }
            };
        })
        .call(this, content);
}

module.exports = buildBusBabelLoader;
