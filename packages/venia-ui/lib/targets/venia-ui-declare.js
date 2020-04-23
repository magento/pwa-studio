module.exports = targets => {
    targets.declare({
        richContentRenderers: new targets.types.Sync(['renderers'])
    });
};
