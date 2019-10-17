const configureWebpack = require('./configureWebpack');
module.exports = Object.assign(configureWebpack, {
    getClientConfig: require('./getClientConfig'),
    getIncludeFeatures: require('./getIncludeFeatures'),
    getServiceWorkerConfig: require('./getServiceWorkerConfig')
});
