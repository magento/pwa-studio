jest.mock('dotenv');
jest.mock('../cli/create-env-file');
const dotenv = require('dotenv');
const loadEnvCliBuilder = require('../cli/load-env');
const createEnv = require('../cli/create-env-file').handler;

let oldMagentoBackendUrl;
beforeEach(() => {
    oldMagentoBackendUrl = process.env.MAGENTO_BACKEND_URL;
    process.env.MAGENTO_BACKEND_URL = '';
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
    process.env.MAGENTO_BACKEND_URL = oldMagentoBackendUrl;
    jest.resetAllMocks();
});

test('is a yargs builder', () => {
    expect(loadEnvCliBuilder).toMatchObject({
        command: expect.stringContaining('load-env'),
        describe: expect.stringContaining('environment'),
        handler: expect.any(Function)
    });
});

test('handler throws on env missing required variables on errors', () => {
    // missing required variables
    dotenv.config.mockReturnValueOnce({
        parsed: {}
    });
    expect(() => loadEnvCliBuilder.handler({ directory: '.' })).toThrow(
        'MAGENTO_BACKEND_URL'
    );
    expect(console.error).toHaveBeenCalled();
});

test('handler loads from dotenv file', () => {
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    dotenv.config.mockReturnValueOnce({
        parsed: process.env
    });
    loadEnvCliBuilder.handler({
        directory: '.'
    });
});

test('warns if dotenv file does not exist', () => {
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    dotenv.config.mockReturnValueOnce({
        error: enoent,
        parsed: process.env
    });
    loadEnvCliBuilder.handler({
        directory: '.'
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('No .env file')
    );
    process.env.MAGENTO_BACKEND_URL = '';
});

test('creates a .env file from example values if --core-dev-mode', () => {
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    dotenv.config.mockReturnValueOnce({
        error: enoent,
        parsed: process.env
    });
    loadEnvCliBuilder.handler({
        directory: '.',
        coreDevMode: true
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Creating new .env file')
    );
    expect(createEnv).toHaveBeenCalled();
    process.env.MAGENTO_BACKEND_URL = '';
});
