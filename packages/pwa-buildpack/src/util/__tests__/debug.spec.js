jest.mock('debug');
const { join } = require('path');
const debug = require('debug');

const myDebug = require('../debug');

beforeEach(() => {
    // must return a function, that's all
    debug.mockImplementation(() => () => {});
});
afterEach(() => jest.resetAllMocks());

test('here(path) creates logger with pathname driven tag', () => {
    myDebug.makeFileLogger(__filename);
    expect(debug).toHaveBeenCalledWith(
        'pwa-buildpack:util:__tests__:debug.spec.js'
    );
});
test('here(path) logger tag does not include index.js', () => {
    myDebug.makeFileLogger(join(__dirname, 'subdir', 'index.js'));
    expect(debug).toHaveBeenCalledWith('pwa-buildpack:util:__tests__:subdir');
});

test('here(path) logger tag formats an error message', () => {
    expect(myDebug.makeFileLogger(__dirname).errorMsg('foo')).toBe(
        '[pwa-buildpack:util:__tests__] foo'
    );
});

test('here(path) logger.sub produces a sub-logger', () => {
    myDebug.makeFileLogger(__dirname).sub('extra');
    expect(debug.mock.calls[1][0]).toBe('pwa-buildpack:util:__tests__:extra');
});
