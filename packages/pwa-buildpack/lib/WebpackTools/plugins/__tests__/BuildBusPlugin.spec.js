jest.mock('pertain', () => (_, subject) => {
    const phase = subject.split('.').pop();
    return [
        {
            name: '@magento/pwa-buildpack',
            path: `./${phase}-base`,
            subject
        }
    ];
});
const BuildBus = require('../../../BuildBus');
const BuildBusPlugin = require('../BuildBusPlugin');

test('binds and calls phases', () => {
    BuildBus.enableTracking();
    const bus = BuildBus.for('./').init();
    const compilerTap = jest.fn();
    bus.getTargetsOf('@magento/pwa-buildpack').webpackCompiler.tap(c =>
        compilerTap(c)
    );

    let compilationTap;
    const mockLog = jest.fn();
    const mockCompiler = {
        hooks: {
            thisCompilation: {
                tap(_, cb) {
                    compilationTap = cb;
                }
            }
        }
    };

    const plugin = new BuildBusPlugin(bus, [
        [{ type: 'night', id: 'ly', parent: { type: 'test', id: 'me' } }, 'foo']
    ]);
    plugin.apply(mockCompiler);
    compilationTap({
        getLogger: () => ({ info: mockLog, log: mockLog })
    });

    expect(mockLog).toHaveBeenCalledWith(
        'foo',
        'test<me>:night<ly>',
        undefined
    );
    expect(compilerTap).toHaveBeenCalledWith(mockCompiler);

    BuildBus.disableTracking();
});
