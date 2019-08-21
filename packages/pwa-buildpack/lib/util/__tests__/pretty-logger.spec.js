const prettyLogger = require('../pretty-logger');

beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(jest.resetAllMocks);

test('logs pretty text to console stderr', () => {
    prettyLogger.log('a log message');
    prettyLogger.warn('a warning');
    prettyLogger.info('an info message');
    prettyLogger.error('an error message');
    prettyLogger.success('a success message');
    expect(console.warn).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
});
