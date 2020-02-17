const BuildBus = require('../BuildBus');

function getEnvVarDefinitions(context) {
    const definitions = { sections: [], changes: [] };

    if (process.env.DEBUG && process.env.DEBUG.includes('BuildBus')) {
        BuildBus.enableTracking();
    }
    const bus = BuildBus.for(context);
    bus.getTargetsOf('@magento/pwa-buildpack').envVarDefinitions.call(
        definitions
    );
    return definitions;
}

module.exports = getEnvVarDefinitions;
