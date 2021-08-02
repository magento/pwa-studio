const { mockBuildBus } = require('@magento/pwa-buildpack/lib/TestHelpers');

const declare = require('../declare');
const intercept = require('../intercept');

const thisDep = {
    name: '@magento/pagebuilder',
    declare,
    intercept
};

test('declares targets customContentTypes', async () => {
    const bus = mockBuildBus({
        context: __dirname,
        dependencies: [thisDep]
    });
    bus.runPhase('declare');
    const { customContentTypes } = bus.getTargetsOf('@magento/pagebuilder');
    expect(customContentTypes.tap).toBeDefined();
    const interceptor = jest.fn();
    // no implementation testing in declare phase
    customContentTypes.tap('test', interceptor);
    customContentTypes.call('woah');
    expect(interceptor).toHaveBeenCalledWith('woah');
});
