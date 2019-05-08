const loadEnvCliBuilder = require('../cli/load-env');

beforeEach(() => {
    jest.spyOn(process, 'exit').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
    jest.restoreAllMocks();
});

test('is a yargs builder', () => {
    expect(loadEnvCliBuilder).toMatchObject({
        command: expect.stringContaining('load-env'),
        describe: expect.stringContaining('environment'),
        handler: expect.any(Function)
    });
});

test('handler exits clean on load', () => {
    jest.resetModules();
    loadEnvCliBuilder.handler({
        directory: { MAGENTO_BACKEND_URL: 'https://example.com' }
    });
    expect(process.exit).not.toHaveBeenCalled();
});

test('handler exits clean on load', () => {
    jest.resetModules();
    loadEnvCliBuilder.handler({ directory: {} });
    expect(process.exit).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
});
