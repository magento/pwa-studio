const {
    addMatchImageSnapshotPlugin
} = require('cypress-image-snapshot/plugin');
const { addSnapshotResizePlugin } = require('./resizeSnapshotPlugin');

module.exports = (on, config) => {
    addMatchImageSnapshotPlugin(on, config);
    addSnapshotResizePlugin(on, config);
};
