jest.mock('../Utilities/configureHost');
jest.mock('../Utilities/loadEnvironment');
const createCustomOriginBuilder = require('../cli/create-custom-origin');
const configureHost = require('../Utilities/configureHost');
const loadEnvironment = require('../Utilities/loadEnvironment');

beforeEach(() => {
    configureHost.mockImplementation(({ exactDomain }) => ({
        hostname: `https://${exactDomain}`,
        ports: {
            development: 9999,
            staging: 10001
        }
    }));
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'chdir').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
});
afterEach(() => {
    jest.restoreAllMocks();
});

test('is a yargs builder', () => {
    expect(createCustomOriginBuilder).toMatchObject({
        command: expect.stringContaining('create-custom-origin'),
        describe: expect.stringContaining('secure'),
        handler: expect.any(Function)
    });
});

test('fails if customOrigin is disabled', async () => {
    loadEnvironment.mockReturnValueOnce({
        section: () => ({
            enabled: false
        })
    });

    await expect(
        createCustomOriginBuilder.handler({ directory: process.cwd() })
    ).rejects.toThrow();
    expect(process.chdir).not.toHaveBeenCalled();
    expect(loadEnvironment).toHaveBeenCalled();
    expect(loadEnvironment.mock.calls[0][0]).toBe(process.cwd());
});

test('runs configureHost from environment settings in passed directory', async () => {
    loadEnvironment.mockReturnValueOnce({
        section: () => ({
            enabled: true,
            exactDomain: 'fake.domain'
        })
    });

    await createCustomOriginBuilder.handler({ directory: process.cwd() });
    expect(process.chdir).not.toHaveBeenCalled();
    expect(loadEnvironment).toHaveBeenCalled();
    expect(loadEnvironment.mock.calls[0][0]).toBe(process.cwd());
    expect(configureHost).toHaveBeenCalledWith(
        expect.objectContaining({
            interactive: true,
            exactDomain: 'fake.domain'
        })
    );
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('cert for https://fake.domain')
    );
});

test('errors out if environment is invalid', async () => {
    loadEnvironment.mockReturnValueOnce({
        error: [new Error('test')]
    });

    await expect(
        createCustomOriginBuilder.handler({ directory: 'path/to/elsewhere' })
    ).rejects.toThrow();
});

test('errors out if custom origins are disabled', async () => {
    loadEnvironment.mockReturnValueOnce({
        section: () => ({
            enabled: ''
        })
    });

    await expect(
        createCustomOriginBuilder.handler({ directory: 'path/to/elsewhere' })
    ).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching('Custom origins in this project are disabled')
    );
});
