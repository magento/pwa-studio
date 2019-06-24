jest.mock('dotenv');
jest.mock('../cli/create-env-file');
const dotenv = require('dotenv');
const loadEnvCliBuilder = require('../cli/load-env');
const createEnv = require('../cli/create-env-file').handler;

const mocks = {
    exit: jest.spyOn(process, 'exit').mockImplementation(() => {}),
    warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
    error: jest.spyOn(console, 'error').mockImplementation(() => {})
};

beforeEach(jest.resetAllMocks);

test('is a yargs builder', () => {
    expect(loadEnvCliBuilder).toMatchObject({
        command: expect.stringContaining('load-env'),
        describe: expect.stringContaining('environment'),
        handler: expect.any(Function)
    });
});

test('handler exits nonzero on errors', () => {
    // missing required variables
    dotenv.config.mockReturnValueOnce({
        parsed: {},
        error: {}
    });
    loadEnvCliBuilder.handler({ directory: '.' });
    expect(mocks.exit).toHaveBeenCalled();
    expect(mocks.error).toHaveBeenCalled();
});

test('handler loads from dotenv file', () => {
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    dotenv.config.mockReturnValueOnce({
        parsed: process.env
    });
    loadEnvCliBuilder.handler({
        directory: '.'
    });
    expect(mocks.exit).not.toHaveBeenCalled();
    process.env.MAGENTO_BACKEND_URL = '';
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
    expect(mocks.warn).toHaveBeenCalledWith(
        expect.stringContaining('No .env file')
    );
    expect(mocks.exit).not.toHaveBeenCalled();
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
    expect(mocks.warn).toHaveBeenCalledWith(
        expect.stringContaining('Creating new .env file')
    );
    expect(createEnv).toHaveBeenCalled();
    expect(mocks.exit).not.toHaveBeenCalled();
    process.env.MAGENTO_BACKEND_URL = '';
});
