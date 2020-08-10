/**
 * @module Buildpack/TestHelpers
 */

/**
 * A mock Webpack loader context for testing target integrations.
 *
 */

class MockWebpackLoaderContext {
    /**
     * Creates a loader context and populates.
     * @param {Function} callback - Called if the loader runs `this.callback(err, output);
     * @param {Object} contextValues - Object that will be copied on to this loader context
     * @constructs MockWebpackLoaderContext
     */
    constructor(callback, contextValues) {
        this.mustReturnSync = true;
        this._callback = callback;
        this._calls = {};
        Object.assign(this, contextValues);
    }
    _saveCall(name, args) {
        this._calls[name] = this._calls[name] || [];
        this._calls[name].push(args);
    }
    async() {
        this.mustReturnSync = false;
        return (...args) => this.callback(...args);
    }
    addDependency(...args) {
        this._saveCall('addDependency', args);
    }
    callback(err, output) {
        this.mustReturnSync = false;
        return this._callback(err, output);
    }
    emitWarning(...args) {
        this._saveCall('emitWarning', args);
    }
    emitError(...args) {
        this._saveCall('emitError', args);
    }
    getCalls(name) {
        return this._calls[name] || [];
    }
    resetCalls() {
        this._calls = {};
    }
}

module.exports = MockWebpackLoaderContext;
