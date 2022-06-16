const componentOverrideMapping = require('@orienteed/pagebuilder/componentOverrideMapping');
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    builtins.specialFeatures.tap(features => {
        features[targets.name] = { esModules: true, cssModules: true };
    });
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });
};
