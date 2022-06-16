const componentOverrideMapping = require('./src/componentOverrideMapping');
const moduleOverridePlugin = require('./src/moduleOverrideWebpackPlugin');

module.exports = targets => {
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');
    specialFeatures.tap(flags => {
        flags[targets.name] = {
            esModules: true,
            cssModules: true
        };
    });

    // Override Compenents
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });
};
