const {
    addMatchImageSnapshotPlugin
} = require('cypress-image-snapshot/plugin');
const { addSnapshotResizePlugin } = require('./resizeSnapshotPlugin');

module.exports = (on, config) => {
    addMatchImageSnapshotPlugin(on, config);
    addSnapshotResizePlugin(on, config);

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
            launchOptions.args.push('--force-color-profile=srgb');
        }

        return launchOptions;
    });
};
