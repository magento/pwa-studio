/**
 * Helper functions for running a full PWA build in integration tests to combine
 * extension targets, build configurations, and frontend code.
 * @module Buildpack/TestHelpers
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { mockBuildBus } = require('./testTargets/testTargets');
const { makeCompiler, compileToPromise } = require('./testWebpackCompiler');
const MagentoResolver = require('../WebpackTools/MagentoResolver');
const ModuleTransformConfig = require('../WebpackTools/ModuleTransformConfig');
const { evalInDom } = require('./evaluateScripts');
const {
    getModuleRules,
    getSpecialFlags,
    getResolveLoader
} = require('../WebpackTools/configureWebpack');
const BuildBusPlugin = require('../WebpackTools/plugins/BuildBusPlugin');

/**
 * A helper function for compiling source code to test PWA Studio extension
 * targets. Uses a full Webpack build and executes all extension intercepts.
 *
 * The BuildBus will run only with the list of dependencies you specify in your
 * test.
 *
 * @example <caption>Test your target which intercepts a Peregrine target.</caption>
 * const { useApp } = buildModuleWith('../lib/talons/App/useApp', {
 *  context: __dirname, // where to resolve modules from
 *  dependencies: [
 *   '@magento/peregrine',
 *   {
 *     name: 'my-extension',
 *     declare: require('../declare'),
 *     intercept: require('../intercept'),
 *   }
 * })
 * expect(useApp()).toHaveProperty('my-additions');
 *
 *
 *
 * @param {string} moduleUnderTest - Path to the module to be evaluated.
 * @param {Object} options - Dependencies and Webpack options to use.
 * @param {string} options.context - Project root of the simulated build, from
 * which on-disk dependencies will be resolved.
 * @param {Array.(string|MockDependency) options.dependencies
 * @returns
 */
async function buildModuleWith(
    moduleUnderTest,
    { context, dependencies, mockFiles = {}, alias, ...otherWebpackSettings }
) {
    const bus = mockBuildBus({
        context,
        dependencies
    });
    bus.init();

    const paths = {
        root: context,
        src: path.resolve(context, 'src')
    };

    const resolver = new MagentoResolver({ paths, alias });

    const transforms = new ModuleTransformConfig(resolver);
    await bus
        .getTargetsOf('@magento/pwa-buildpack')
        .transformModules.promise(x => transforms.add(x));

    const transformRequests = await transforms.toLoaderOptions();

    let entry;
    // Most of the time, the entry module is a real file.
    // But it could also be supplied by mockFiles, in which case the resolver
    // would not be able to resolve it.
    if (mockFiles[moduleUnderTest]) {
        entry = moduleUnderTest;
    } else {
        entry = await resolver.resolve(moduleUnderTest);
    }

    const hasFlag = await getSpecialFlags(
        otherWebpackSettings.special || {},
        bus,
        resolver
    );

    const helper = {
        bus,
        hasFlag,
        babelRootMode: 'upward',
        mode: 'test',
        paths,
        resolver,
        transformRequests
    };

    // Leave most modules external, so Webpack builds faster.
    const externals = [
        // Exclude any require() of a node_module.
        nodeExternals({
            // Except...
            allowlist: bus
                // the dependencies under test, which Webpack must compile for
                // the targets to work!
                .getMockDependencyNames()
                // A string would require an exact match:
                // '@magento/peregrine' would not allow '@magento/peregrine/lib'
                // so we make a regex that tests for the start of the string
                // instead
                .map(name => new RegExp(`^${name}`))
        })
    ];

    const webpackConfig = {
        context,
        entry,
        output: {
            filename: 'main.js',
            globalObject: 'exports',
            libraryTarget: 'commonjs'
        },
        module: {
            rules: [
                await getModuleRules.graphql(helper),
                await getModuleRules.js(helper),
                {
                    test: /\.css$/,
                    use: ['identity-obj-proxy-loader']
                }
            ]
        },
        resolve: resolver.config,
        resolveLoader: getResolveLoader(),
        externals,
        ...otherWebpackSettings
    };

    webpackConfig.plugins = webpackConfig.plugins || [];

    if (
        !webpackConfig.plugins.some(plugin => plugin instanceof BuildBusPlugin)
    ) {
        webpackConfig.plugins.unshift(new BuildBusPlugin(bus));
    }

    const compiler = makeCompiler(webpackConfig, mockFiles);
    const results = await compileToPromise(compiler);
    const bundle = results.files[webpackConfig.output.filename];
    return {
        ...results,
        bundle,
        run() {
            return evalInDom(bundle, require);
        }
    };
}

module.exports = { buildModuleWith };
