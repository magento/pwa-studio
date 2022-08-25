/**
 * Helper functions for running a Webpack compiler in tests.
 * @module Buildpack/TestHelpers
 */

const path = require('path');
const webpack = require('webpack');
const deepDefaults = require('../util/deep-defaults');

const fs = require('fs');
const { Union } = require('unionfs');
const { Volume } = require('memfs');

/**
 * Create a harnessed Webpack compiler for testing. This compiler has some
 * tweaks for testing your components, targets, or plugins in a unit test
 * framework. It can use a supplied map of virtual files instead of an on-disk fixture, and it records logs and output files in a friendly format on the `.testResults` property.
 * @param {Object} config - Webpack configuration object.
 * @param {MockFiles} mockFiles - An object of file paths to source code strings, to populate the virtual file system (and lay over the real one)
 * @returns {Object} compiler - Webpack compiler object.
 * @returns {Object} compiler.testResults - Test metadata.
 *
 */
const makeCompiler = (config, mockFiles = {}) => {
    const inputFileSystem = new Union();
    inputFileSystem.use(fs).use(Volume.fromJSON(mockFiles, config.context));

    const defaults = {
        mode: 'none',
        optimization: {
            minimize: false
        },
        output: {
            path: config.context
        }
    };
    const finalOptions = deepDefaults(config, defaults);

    const compiler = webpack(finalOptions);

    compiler.inputFileSystem = inputFileSystem;
    compiler.resolvers.normal.fileSystem = inputFileSystem;
    compiler.resolvers.context.fileSystem = inputFileSystem;

    const files = {};
    const logs = {
        mkdirp: [],
        writeFile: []
    };
    compiler.outputFileSystem = {
        join() {
            return [].join.call(arguments, '/').replace(/\/+/g, '/');
        },
        mkdirp(path, callback) {
            logs.mkdirp.push(path);
            callback();
        },
        writeFile(absPath, content, callback) {
            const name = path.relative(finalOptions.context, absPath);
            logs.writeFile.push(name, content);
            files[name] = content.toString('utf-8');
            callback();
        }
    };
    compiler.hooks.compilation.tap(
        'CompilerTest',
        compilation => (compilation.bail = true)
    );

    compiler.testResults = {
        files,
        logs
    };
    return compiler;
};

/**
 * Invoke compiler.run() and return a promise for the Webpack output.
 * @async
 * @param {Object} compiler - The Webpack compiler instance.
 * @returns {Object} testResults - Webpack output and results.
 * @returns {Object} testResults.stats - Webpack stats object.
 * @returns {Object} testResults.files - An object of output file text.
 * @returns {Object} testResults.logs - An array of log messages.
 *
 */
const compileToPromise = compiler =>
    new Promise((res, rej) => {
        compiler.run((err, stats) => {
            if (err) {
                return rej(err);
            }
            stats = stats.toJson({
                modules: true,
                reasons: true
            });
            if (stats.errors.length > 0) {
                return rej(stats.errors[0]);
            }
            if (!compiler.testResults) {
                rej(
                    new Error(
                        'Compiler was not created with makeCompiler, cannot use compileToPromise on it'
                    )
                );
            } else {
                res({ ...compiler.testResults, stats });
            }
        });
    });

module.exports = { makeCompiler, compileToPromise };
