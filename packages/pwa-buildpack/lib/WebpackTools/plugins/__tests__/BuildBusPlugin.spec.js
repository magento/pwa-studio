const { inspect } = require('util');
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
    const bus = BuildBus.for('./');
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

    const plugin = new BuildBusPlugin(bus, [['foo']]);
    plugin.apply(mockCompiler);
    compilationTap({
        getLogger: () => ({ log: mockLog })
    });

    expect(mockLog).toHaveBeenCalledWith(inspect(['foo']));
    expect(compilerTap).toHaveBeenCalledWith(mockCompiler);

    BuildBus.disableTracking();
});
