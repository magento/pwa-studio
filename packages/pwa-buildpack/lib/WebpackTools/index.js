const Targetables = require('./targetables');
module.exports = {
    Targetables,
    ...Targetables,
    ModuleTransformConfig: require('./ModuleTransformConfig'),
    configureWebpack: require('./configureWebpack'),
    RootComponentsPlugin: require('./plugins/RootComponentsPlugin'),
    ServiceWorkerPlugin: require('./plugins/ServiceWorkerPlugin'),
    MagentoResolver: require('./MagentoResolver'),
    PWADevServer: require('./PWADevServer'),
    UpwardDevServerPlugin: require('./plugins/UpwardDevServerPlugin')
};
