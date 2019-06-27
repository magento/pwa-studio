jest.mock('../Utilities/configureHost');
jest.mock('../Utilities/loadEnvironment');
jest.mock('word-wrap', () => x => x);
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
        expect.objectContaining({
            interactive: true,
            exactDomain: 'fake.domain'
        })
    );
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('cert for https://fake.domain')
    );
});

test('changes to passed directory to run configureHost', async () => {
    loadEnvironment.mockReturnValueOnce({
        section: () => ({
            exactDomain: 'fake2.domain'
        })
    });

    await createCustomOriginBuilder.handler({ directory: 'path/to/elsewhere' });
    expect(process.chdir).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/path\/to\/elsewhere$/)
    );
    expect(loadEnvironment).toHaveBeenCalledWith(
        process.chdir.mock.calls[0][0]
    );
    expect(process.chdir).toHaveBeenNthCalledWith(2, process.cwd());
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
