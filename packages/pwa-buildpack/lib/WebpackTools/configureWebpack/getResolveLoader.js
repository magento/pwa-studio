/**
 * @module Buildpack/WebpackTools
 */
const path = require('path');

/**
 * Configuration object that helps Webpack find Buildpack's builtin loaders,
 * along with any other loaders installed as Node modules.
 * Assign the return value to the `resolveLoaders` property of Webpack config.
 *
 * @returns {Object} Loader resolve configuration.
 */
function getResolveLoader() {
    return {
        modules: [path.resolve(__dirname, '../loaders'), 'node_modules'],
        extensions: ['.js'],
        mainFields: ['loader', 'main']
    };
}

module.exports = getResolveLoader;
