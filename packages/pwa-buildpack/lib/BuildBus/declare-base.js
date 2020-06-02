module.exports = targets => {
    targets.declare({
        envVarDefinitions: new targets.types.Sync(['definitions']),
        webpackCompiler: new targets.types.Sync(['compiler']),
        specialFeatures: new targets.types.Sync(['special'])
    });
};
