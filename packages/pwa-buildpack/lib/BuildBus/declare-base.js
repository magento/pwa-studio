module.exports = targets => {
    targets.declare({
        webpackCompiler: new targets.types.Sync(['compiler']),
        specialFeatures: new targets.types.Sync(['special'])
    });
};
