const { SyncHook } = require('tapable');

module.exports = api => {
    api.declareTarget('webpackCompiler', new SyncHook(['compiler']));
    api.declareTarget('specialFeatures', new SyncHook(['featuresByModule']));
};
