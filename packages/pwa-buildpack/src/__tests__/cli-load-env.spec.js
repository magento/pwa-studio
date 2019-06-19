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

test('handler exits nonzero on errors', () => {
    jest.resetModules();
    // missing required variables
    loadEnvCliBuilder.handler({ directory: {} });
    expect(process.exit).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
});

test('handler loads from dotenv file', () => {
    jest.resetModules();
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    jest.doMock('dotenv', () => ({
        config: () => ({
            parsed: process.env
        })
    }));
    loadEnvCliBuilder.handler({
        directory: '.'
    });
    expect(process.exit).not.toHaveBeenCalled();
    process.env.MAGENTO_BACKEND_URL = '';
});
