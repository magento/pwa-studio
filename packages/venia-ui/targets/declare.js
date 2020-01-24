const { SyncHook } = require('tapable');
module.exports = api => {
    api.declareTarget('richContentRenderers', new SyncHook(['renderers']));
};
