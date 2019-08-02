jest.mock('../Utilities/configureHost');
jest.mock('../Utilities/loadEnvironment');
jest.mock('word-wrap', () => x => x);
const createCustomOriginBuilder = require('../cli/create-custom-origin');
const configureHost = require('../Utilities/configureHost');
const loadEnvironment = require('../Utilities/loadEnvironment');

beforeEach(() => {
    configureHost.mockImplementation((dir, { exactDomain }) => ({
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

test('runs configureHost from environment settings in passed directory', async () => {
    loadEnvironment.mockReturnValueOnce({
        section: () => ({
            exactDomain: 'fake.domain'
        })
    });

    await createCustomOriginBuilder.handler({ directory: process.cwd() });
    expect(process.chdir).not.toHaveBeenCalled();
    expect(loadEnvironment).toHaveBeenCalledWith(process.cwd());
    expect(configureHost).toHaveBeenCalledWith(
        expect.any(String),
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

    await createCustomOriginBuilder.handler({ directory: 'path/to/elsewhere' });
    expect(process.exit).toHaveBeenCalled();
});

test('errors out if custom origins are disabled', async () => {
    loadEnvironment.mockReturnValueOnce({
        section: () => ({
            enabled: ''
        })
    });

    await createCustomOriginBuilder.handler({ directory: 'path/to/elsewhere' });
    expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching('Custom origins in this project are disabled')
    );
    expect(process.exit).toHaveBeenCalled();
});
