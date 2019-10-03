jest.mock('../Utilities/createProject');
jest.mock('../Utilities/findPackageRoot');
jest.mock('../cli/create-env-file');
jest.mock('execa');
jest.mock('fs-extra');
const yargs = require('yargs');
const execa = require('execa');
const createProject = require('../Utilities/createProject');
const findPackageRoot = require('../Utilities/findPackageRoot');
const createProjectCliBuilder = require('../cli/create-project');

beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
    jest.restoreAllMocks();
});

test('is a yargs builder', async () => {
    expect(createProjectCliBuilder).toMatchObject({
        command: expect.stringContaining('create-project'),
        describe: expect.stringContaining('Create a PWA'),
        handler: expect.any(Function)
    });
    const mockCommand = {
        ...createProjectCliBuilder,
        handler: jest.fn()
    };
    const parser = yargs.command(mockCommand).help();

    const output = await new Promise((resolve, reject) =>
        parser.parse('--help', (err, argv, output) =>
            err ? reject(err) : resolve(output)
        )
    );

    expect(output).toMatch('Create a PWA');

    // throws because it wants a positional argument--just checking
    expect(() => createProjectCliBuilder.builder(yargs)).toThrow('positional');
});

test('locates a local package', async () => {
    findPackageRoot.local.mockResolvedValueOnce(
        '/somewhere/packages/venia-concept'
    );
    await expect(
        createProjectCliBuilder.handler({
            name: 'goo',
            template: '@magento/venia-concept',
            directory: '/project'
        })
    ).resolves.not.toThrow();
    expect(createProject).toHaveBeenCalledWith(
        expect.objectContaining({
            name: 'goo',
            template: '/somewhere/packages/venia-concept'
        })
    );
});
test('locates template on npm', async () => {
    findPackageRoot.remote.mockResolvedValueOnce('/tmp/@vendor/npm-template');
    await expect(
        createProjectCliBuilder.handler({
            name: 'goo',
            template: '@vendor/npm-template',
            directory: '/project'
        })
    ).resolves.not.toThrow();
    expect(createProject).toHaveBeenCalledWith(
        expect.objectContaining({
            name: 'goo',
            template: expect.stringMatching('/tmp/@vendor/npm-template')
        })
    );
});

test('warns if backendurl does not match env', async () => {
    const old = process.env.MAGENTO_BACKEND_URL;
    process.env.MAGENTO_BACKEND_URL = 'https://other-example.com';
    findPackageRoot.local.mockResolvedValueOnce(
        '/somewhere/packages/venia-concept'
    );
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            name: 'goo',
            template: '@magento/venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.MAGENTO_BACKEND_URL).not.toBe('https://example.com');
    expect(
        console.warn.mock.calls.some(args =>
            args.some(arg => arg.includes('variable overrides'))
        )
    ).toBeTruthy();
    process.env.MAGENTO_BACKEND_URL = old;
});

test('runs install', async () => {
    process.env.MAGENTO_BACKEND_URL = 'https://consistent.website';
    findPackageRoot.local.mockResolvedValueOnce('/something');
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://consistent.website',
            name: 'goo',
            template: '@magento/venia-concept',
            directory: process.cwd(),
            install: true,
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(
        console.warn.mock.calls.some(args =>
            args.some(arg => arg.includes('variable overrides'))
        )
    ).not.toBeTruthy();
    expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringMatching('Environment variable overrides!')
    );
    expect(execa.shell).toHaveBeenCalledWith('yarn install', expect.anything());
});

test('errors out on a bad npm package', async () => {
    findPackageRoot.local.mockResolvedValueOnce(null);
    findPackageRoot.remote.mockResolvedValueOnce(null);
    await expect(
        createProjectCliBuilder.handler({
            name: 'package-name',
            template: 'bad template name',
            directory: '/project',
            install: true,
            npmClient: 'yarn'
        })
    ).rejects.toThrow('Invalid');
});
