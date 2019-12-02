jest.mock('dotenv');
jest.mock('../cli/create-env-file');
const dotenv = require('dotenv');
const loadEnvCliBuilder = require('../cli/load-env');
const createEnv = require('../cli/create-env-file').handler;

const proc = {
    exit: jest.fn()
};

let oldMagentoBackendUrl;
beforeEach(() => {
    oldMagentoBackendUrl = process.env.MAGENTO_BACKEND_URL;
    process.env.MAGENTO_BACKEND_URL = '';
    proc.exit.mockClear();
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

test('handler exits nonzero on missing required variables on errors', () => {
    // missing required variables
    dotenv.config.mockReturnValueOnce({
        parsed: {}
    });
    loadEnvCliBuilder.handler({ directory: '.' }, proc);
    expect(console.error).toHaveBeenCalled();
    expect(proc.exit).toHaveBeenCalledTimes(1);
    expect(proc.exit.mock.calls[0][0]).toBeGreaterThan(0);
});

test('handler loads from dotenv file', () => {
    // Arrange.
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    dotenv.config.mockReturnValueOnce({
        parsed: process.env
    });

    // Act.
    const result = loadEnvCliBuilder.handler(
        {
            directory: '.'
        },
        proc
    );

    // Assert.
    expect(result).toBeUndefined();
    expect(console.warn).not.toHaveBeenCalled();
});

test('warns if dotenv file does not exist', () => {
    // Arrange.
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';

    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    
    dotenv.config.mockReturnValueOnce({
        error: enoent,
        parsed: process.env
    });

    // Act.
    loadEnvCliBuilder.handler(
        {
            directory: '.'
        },    
        proc
    );

    // Assert.
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('No .env file')
    );
    expect(proc.exit).toHaveBeenCalledTimes(1);
});

test('creates a .env file from example values if --core-dev-mode', () => {
    // Arrange.
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    
    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';
    
    dotenv.config.mockReturnValueOnce({
        error: enoent,
        parsed: process.env
    });
    
    // Act.
    loadEnvCliBuilder.handler({
        directory: '.',
        coreDevMode: true
    }, proc);

    // Assert.
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Creating new .env file')
    );
    expect(createEnv).toHaveBeenCalled();
    expect(proc.exit).not.toHaveBeenCalled();
});
