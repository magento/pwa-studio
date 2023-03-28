const ServerModuleOverridePlugin = require('./lib/ServerModuleOverridePlugin');

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        flags[targets.name] = { esModules: true };
    });
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new ServerModuleOverridePlugin().apply(compiler);
    });
};
