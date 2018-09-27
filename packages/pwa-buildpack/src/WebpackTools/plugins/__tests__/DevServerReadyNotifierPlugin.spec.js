const stripAnsi = require('strip-ansi');
const DevServerReadyNotifierPlugin = require('../DevServerReadyNotifierPlugin');

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation();
});

let compiler, notifier;
beforeEach(() => {
    jest.useFakeTimers();
    compiler = {
        plugin: jest.fn()
    };
    notifier = new DevServerReadyNotifierPlugin({
        https: true,
        host: 'fake.hostname',
        port: 8765
    });
    notifier.apply(compiler);
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    console.log.mockRestore();
    jest.useRealTimers();
});

test('taps `done` hook of webpack compiler', () => {
    expect(compiler.plugin).toHaveBeenCalledWith('done', expect.any(Function));
});

test('logs notification to console', () => {
    const notifierFn = compiler.plugin.mock.calls[0][1];
    notifierFn();
    jest.runAllTimers();

    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch(
        'PWADevServer ready at https://fake.hostname:8765'
    );
});

test('handles unsecure URLs', () => {
    compiler = {
        plugin: jest.fn()
    };
    notifier = new DevServerReadyNotifierPlugin({
        https: false,
        host: 'unsecure.hostname',
        port: 8765
    });
    notifier.apply(compiler);
    const notifierFn = compiler.plugin.mock.calls[0][1];
    notifierFn();
    jest.runAllTimers();

    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch(
        'PWADevServer ready at http://unsecure.hostname:8765'
    );
});

test('only runs once per plugin instance', () => {
    const notifierFn = compiler.plugin.mock.calls[0][1];

    notifierFn();
    jest.runAllTimers();

    expect(console.log).toHaveBeenCalledTimes(1);
    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch(
        'PWADevServer ready at https://fake.hostname:8765'
    );

    notifierFn();
    jest.runAllTimers();

    expect(console.log).toHaveBeenCalledTimes(1);
});

test('errors if supplied an object it cannot build a URL with', () => {
    const badArgs = [undefined, {}, { port: 8765 }, { host: 'fake.hostonly' }];
    badArgs.forEach(arg => {
        expect(() => {
            new DevServerReadyNotifierPlugin(arg);
        }).toThrow('must be an object with host and port properties');
    });
});
