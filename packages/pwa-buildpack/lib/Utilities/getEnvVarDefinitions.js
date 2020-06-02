const debug = require('debug')('pwa-buildpack:getEnvVarDefinitions');

function getEnvVarDefinitions(context) {
    // Fastest way to copy a pure-JSON object.
    const definitions = JSON.parse(
        JSON.stringify(require('../../envVarDefinitions.json'))
    );
    try {
        const BuildBus = require('../BuildBus');
        /* istanbul ignore next */
        if (process.env.DEBUG && process.env.DEBUG.includes('BuildBus')) {
            BuildBus.enableTracking();
        }
        const bus = BuildBus.for(context);
        bus.getTargetsOf('@magento/pwa-buildpack').envVarDefinitions.call(
            definitions
        );
        debug(
            'BuildBus for %s augmented env var definitions from buildpack.envVarDefinitions interceptors',
            context
        );
    } catch (e) {
        debug(
            'BuildBus for %s errored calling buildpack.envVarDefinitions. Proceeding with base definitions',
            context
        );
    }
    return definitions;
}

module.exports = getEnvVarDefinitions;
