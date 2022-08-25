/**
 * Helper functions for running generated code in tests.
 * @module Buildpack/TestHelpers
 */
const path = require('path');
const babel = require('@babel/core');
const vm = require('vm');
const { JSDOM } = require('jsdom');

/**
 * Consolidate all types of export in a sandbox into the returned export object.
 * @private
 */
const getExports = sandbox => {
    if (sandbox.exports.default) {
        const defaultType = typeof sandbox.exports.default;
        if (defaultType === 'function' || defaultType === 'object') {
            return Object.assign(sandbox.exports.default, sandbox.exports);
        } else {
            return sandbox.exports.default;
        }
    } else {
        return sandbox.exports;
    }
};

/**
 * Evaluate JavaScript source code in a test environment. CommonJS exports will
 * be returned. Imperative code in the module will run in the context of an
 * isolated sandbox, using the Node {@link https://nodejs.org/docs/latest-v10.x/api/vm.html#vm_vm_executing_javascript vm module}.
 *
 * `evalScript` can only execute JS that would run natively in Node.
 * Use {@linkcode evalEsModule} to run ESNext modules, and {@linkcode evalInDom}
 * to run code in a browser-like environment.
 * @param {string} source - Code to be evaluated.
 * @param {function} require - The `require()` function the code will use to request other modules.
 * @returns The `exports` from the source code sandbox.
 */
function evalScript(source, requireFn) {
    const sandbox = { require: requireFn, exports: {} };
    vm.runInNewContext(source, sandbox);
    return getExports(sandbox);
}

/**
 * Evaluate ECMAScript modules in a test environment. Exported values will be
 * returned. Imperative code (boo!) in the module will run in the context of an
 * isolated sandbox.
 *
 * Code is transpiled on the fly using Babel. By default, Babel will use the
 * configuration file accessible from the working directory. Dynamic imports
 * are not supported.
 *
 * @see evalScript
 * @param {string} source - Module code to be evaluated.
 * @param {Function} require - The `require()` function the transpiled code
 * will use to `import` other modules.
 * @param {Object} [babelOptions={}] Additional options to be passed to Babel.
 * @returns Exported module.
 */
function evalEsModule(source, require, babelOptions = {}) {
    if (!babelOptions.filename) {
        babelOptions.filename = path.resolve(
            __dirname,
            'evaluated-es6-module.js' // For debugging
        );
    }
    const out = evalScript(
        babel.transformSync(source, babelOptions).code,
        require
    );
    return out.exports || out;
}

/**
 * Evaluate JavaScript source code in the context of a JSDOM simulated browser
 * environment. Imperative code in the module will run with access to the
 * simulated `window` and `document` objects.
 *
 * The code does not run in a headless browser, but in Node natively.
 *
 * @see evalScript
 * @param {string} source - Module code to be evaluated.
 * @param {Function} require - The `require()` function the transpiled code
 * will use to `import` other modules.
 * @param {Object} [jsDomOptions] Additional options to be passed to `JSDOM`.
 * @returns The `exports` from the DOM sandbox.
 */
function evalInDom(content, require, jsDomOptions) {
    const options = Object.assign(
        {
            url: 'https://localhost',
            runScripts: 'outside-only'
        },
        jsDomOptions
    );
    const dom = new JSDOM('', options);
    const sandbox = dom.getInternalVMContext();
    sandbox.require = require;
    sandbox.exports = {};
    vm.runInContext(content, sandbox);
    return getExports(sandbox);
}

module.exports = { evalEsModule, evalInDom, evalScript };
