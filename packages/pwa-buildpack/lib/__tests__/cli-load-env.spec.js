jest.mock('dotenv');
jest.mock('../cli/create-env-file');
jest.mock('../Utilities/getEnvVarDefinitions', () => () =>
    jest.requireActual('../../envVarDefinitions.json')
);
const dotenv = require('dotenv');
const loadEnvCliBuilder = require('../cli/load-env');
const createEnv = require('../cli/create-env-file').handler;

jest.mock('../Utilities/runEnvValidators', () =>
    jest.fn().mockResolvedValue(true)
);

const proc = {
    exit: jest.fn()
};

let oldMagentoBackendUrl;
let oldBraintreeToken;
beforeEach(() => {
    oldMagentoBackendUrl = process.env.MAGENTO_BACKEND_URL;
    oldBraintreeToken = process.env.CHECKOUT_BRAINTREE_TOKEN;
    process.env.MAGENTO_BACKEND_URL = '';
    process.env.CHECKOUT_BRAINTREE_TOKEN = '';

    proc.exit.mockClear();

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
    process.env.MAGENTO_BACKEND_URL = oldMagentoBackendUrl;
    process.env.CHECKOUT_BRAINTREE_TOKEN = oldBraintreeToken;

    jest.resetAllMocks();
});

test('is a yargs builder', () => {
    expect(loadEnvCliBuilder).toMatchObject({
        command: expect.stringContaining('load-env'),
        describe: expect.stringContaining('environment'),
        handler: expect.any(Function)
    });
});

test('handler exits nonzero on missing required variables on errors', async () => {
    // missing required variables
    dotenv.config.mockReturnValueOnce({
        parsed: {}
    });
    await loadEnvCliBuilder.handler({ directory: '.' }, proc);
    expect(console.error).toHaveBeenCalled();
    expect(proc.exit).toHaveBeenCalledTimes(1);
    expect(proc.exit.mock.calls[0][0]).toBeGreaterThan(0);
});

test('handler loads from dotenv file', async () => {
    // Arrange.
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    process.env.CHECKOUT_BRAINTREE_TOKEN = 'my_custom_value';
    dotenv.config.mockReturnValueOnce({
        parsed: process.env
    });

    // Act.
    const result = await loadEnvCliBuilder.handler(
        {
            directory: '.'
        },
        proc
    );

    // Assert.
    expect(result).toBeUndefined();
});

test('warns if dotenv file does not exist', async () => {
    // Arrange.
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    process.env.CHECKOUT_BRAINTREE_TOKEN = 'my_custom_value';

    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';

    dotenv.config.mockReturnValueOnce({
        error: enoent,
        parsed: process.env
    });

    // Act.
    await loadEnvCliBuilder.handler(
        {
            directory: '.'
        },
        proc
    );

    // Assert.
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('No .env file')
    );
});

test('creates a .env file from example values if --core-dev-mode', async () => {
    // Arrange.
    process.env.MAGENTO_BACKEND_URL = 'https://glorp.zorp';
    process.env.CHECKOUT_BRAINTREE_TOKEN = 'my_custom_value';

    const enoent = new Error('ENOENT');
    enoent.code = 'ENOENT';

    dotenv.config.mockReturnValueOnce({
        error: enoent,
        parsed: process.env
    });

    // Act.
    await loadEnvCliBuilder.handler(
        {
            directory: '.',
            coreDevMode: true
        },
        proc
    );

    // Assert.
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Creating new .env file')
    );
    expect(createEnv).toHaveBeenCalled();
    expect(proc.exit).not.toHaveBeenCalled();
});
