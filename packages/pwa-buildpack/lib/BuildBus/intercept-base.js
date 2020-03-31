module.exports = targets => {
    targets.own.envVarDefinitions.tap(defs => {
        const { sections, changes } = require('../../envVarDefinitions.json');
        defs.sections.push(...sections);
        defs.changes.push(...changes);
    });
};
