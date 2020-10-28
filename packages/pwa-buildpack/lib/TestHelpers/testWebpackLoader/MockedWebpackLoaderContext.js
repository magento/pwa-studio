/**
 * @module Buildpack/TestHelpers
 */

/**
 * A mock Webpack loader context for testing target integrations.
 *
 */
class MockWebpackLoaderContext {
    get rootContext() {
        return this.context;
    }
    get request() {
        return this.resourcePath + '?this-loader!';
    }
    get resource() {
        return this.resourcePath + '?this-loader';
    }
    get fs() {
        throw this._notImplemented('fs');
    }
    get value() {
        throw this._notImplementedAndDeprecated('value');
    }
    get inputValue() {
        throw this._notImplementedAndDeprecated('inputValue');
    }
    get options() {
        throw this._notImplementedAndDeprecated('options', 'Use this.query');
    }
    get debug() {
        throw this._notImplementedAndDeprecated('debug');
    }
    get minimize() {
        throw this._notImplementedAndDeprecated('minimize');
    }
    get _compilation() {
        throw this._notImplementedAndDeprecated('_compilation');
    }
    get _compiler() {
        throw this._notImplementedAndDeprecated('_compiler');
    }
    get _module() {
        throw this._notImplementedAndDeprecated('_module');
    }
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
        this.loaderIndex = 0;

        const defaults = {
            version: 2,
            context: './',
            data: {},
            resourcePath: '/content-file',
            target: 'web',
            webpack: true,
            mode: 'none'
        };
        Object.assign(this, defaults, contextValues);
    }
    async() {
        this.mustReturnSync = false;
        return (...args) => this.callback(...args);
    }
    addContextDependency(...args) {
        this._saveCall('addContextDependency', args);
    }
    addDependency(...args) {
        this._saveCall('addDependency', args);
    }
    cacheable(flag = true) {
        this._cacheable = flag;
    }
    callback(err, output) {
        this.mustReturnSync = false;
        return this._callback(err, output);
    }
    clearDependencies() {
        this._saveCall('clearDependencies');
    }
    emitWarning(...args) {
        this._saveCall('emitWarning', args);
    }
    emitError(...args) {
        this._saveCall('emitError', args);
    }
    exec() {
        throw this._notImplementedAndDeprecated('exec');
    }
    getCalls(name) {
        return this._calls[name] || [];
    }
    loadModule() {
        throw this._notImplemented('loadModule');
    }
    resetCalls() {
        this._calls = {};
    }
    resolve() {
        throw this._notImplemented('resolve');
    }
    resolveSync() {
        throw this._notImplementedAndDeprecated(
            'resolveSync',
            'Use async this.resolve() instead'
        );
    }
    _notImplemented(what, note) {
        const msg = `${this.constructor.name}#${what} not implemented`;
        return new Error(note ? `${msg}\nNote: ${node}` : msg);
    }
    _notImplementedAndDeprecated(what, instead) {
        const note = `loaderContext#${what} is deprecated in Webpack!`;
        return this._notImplemented(
            what,
            instead ? `${note} ${instead}` : instead
        );
    }
    _saveCall(name, args) {
        this._calls[name] = this._calls[name] || [];
        this._calls[name].push(args);
    }
}

module.exports = MockWebpackLoaderContext;
