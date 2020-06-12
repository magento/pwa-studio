/**
 * @module Buildpack/TestHelpers
 */
const MockWebpackLoaderContext = require('./MockedWebpackLoaderContext');

/**
 * Test a Webpack loader by simulating Webpack calling it with source code.
 *
 * @async
 * @param {Function} loader - The loader function to test.
 * @param {string} content - Source code to be transformed and/or analyzed.
 * @param {Object} contextValues - Values to use to populate the Webpack
 *   `loaderContext`, the `this` object available in loaders.
 * @returns Output of the loader.
 */
async function runLoader(loader, content, contextValues) {
    return new Promise((res, rej) => {
        const callback = (err, output) => {
            if (err) {
                rej(err);
            } else {
                res({ context, output });
            }
        };

        const context = new MockWebpackLoaderContext(callback, contextValues);

        const output = loader.call(context, content);
        if (context.mustReturnSync) {
            res({ context, output });
        }
    });
}

module.exports = { runLoader };
