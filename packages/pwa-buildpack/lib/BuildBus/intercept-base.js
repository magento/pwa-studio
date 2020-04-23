/** @ignore */
module.exports = targets => {
    /**
     * Intercept our own `envVarDefinitions` target to provide the base
     * definitions for core functionality.
     */
    targets.own.envVarDefinitions.tap(defs => {
        const { sections, changes } = require('../../envVarDefinitions.json');
        defs.sections.push(...sections);
        defs.changes.push(...changes);
    });
};
