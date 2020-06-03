/** @module Buildpack/TestHelpers */
const MockedWebpackLoaderContext = require('./MockedWebpackLoaderContext');
module.exports = {
    ...require('./testWebpackLoader'),
    MockedWebpackLoader: MockedWebpackLoaderContext
};
