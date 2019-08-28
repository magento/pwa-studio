const MediaBackendURLFetcherPlugin = require('../MediaBackendURLFetcherPlugin');

test.skip('The plugin prototype should have apply function in its Prototype', () => {
    expect(
        MediaBackendURLFetcherPlugin.prototype.hasOwnProperty('apply')
    ).toBeTruthy();
});
