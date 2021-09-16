jest.mock('execa');
jest.mock('fs-extra');
jest.mock('../Utilities/createProject');
jest.mock('../cli/create-env-file');
jest.mock('../Utilities/TemplateRepository');
const yargs = require('yargs');
const createProject = require('../Utilities/createProject');
const TemplateRepository = require('../Utilities/TemplateRepository');
const fse = require('fs-extra');
const createProjectCliBuilder = require('../cli/create-project');

const repo = TemplateRepository.prototype;
beforeEach(() => {
    fse.ensureDir.mockReset();
    jest.spyOn(repo, 'findTemplateDir');
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

test('locates package with TemplateRepository', async () => {
    repo.findTemplateDir.mockResolvedValueOnce(
        '/path/to/@magento/venia-concept'
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
            template: expect.stringMatching('@magento/venia-concept')
        })
    );
    expect(TemplateRepository).toHaveBeenCalled();
    expect(repo.findTemplateDir).toHaveBeenCalledWith('@magento/venia-concept');
});

test('configures TemplateRepository to local only if --debug-scaffolding is set', async () => {
    repo.findTemplateDir.mockResolvedValueOnce('/path/to/venia');
    await expect(
        createProjectCliBuilder.handler({
            name: 'goo',
            template: '@magento/venia',
            directory: '/project',
            testScaffolding: true
        })
    ).resolves.not.toThrow();
    expect(createProject).toHaveBeenCalledWith(
        expect.objectContaining({
            name: 'goo',
            template: '/path/to/venia'
        })
    );
    expect(TemplateRepository).toHaveBeenCalledWith(
        expect.objectContaining({
            cache: false,
            local: true
        })
    );
});

test('warns if backendUrl does not match env', async () => {
    const old = process.env.MAGENTO_BACKEND_URL;
    process.env.MAGENTO_BACKEND_URL = 'https://other-example.com';
    fse.ensureDir.mockResolvedValueOnce(true);
    fse.readdir.mockResolvedValueOnce(true);
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            name: 'goo',
            template: 'venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.MAGENTO_BACKEND_URL).not.toBe('https://example.com');
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('Environment variable overrides!')
    );
    process.env.MAGENTO_BACKEND_URL = old;
});

test('does not warn if backendUrl matches env', async () => {
    const old = process.env.MAGENTO_BACKEND_URL;
    process.env.MAGENTO_BACKEND_URL = 'https://example.com';
    fse.ensureDir.mockResolvedValueOnce(true);
    fse.readdir.mockResolvedValueOnce(true);
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            name: 'goo',
            template: 'venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.MAGENTO_BACKEND_URL).toBe('https://example.com');
    process.env.MAGENTO_BACKEND_URL = old;
});

test('warns if backendEdition does not match env', async () => {
    const old = process.env.MAGENTO_BACKEND_EDITION;
    process.env.MAGENTO_BACKEND_EDITION = 'CE';
    fse.ensureDir.mockResolvedValueOnce(true);
    fse.readdir.mockResolvedValueOnce(true);
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            backendEdition: 'EE',
            name: 'goo',
            template: 'venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.MAGENTO_BACKEND_EDITION).not.toBe('EE');
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('Environment variable overrides!')
    );
    process.env.MAGENTO_BACKEND_EDITION = old;
});

test('does not warn if backendEdition matches env', async () => {
    const old = process.env.MAGENTO_BACKEND_EDITION;
    process.env.MAGENTO_BACKEND_EDITION = 'EE';
    fse.ensureDir.mockResolvedValueOnce(true);
    fse.readdir.mockResolvedValueOnce(true);
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            backendEdition: 'EE',
            name: 'goo',
            template: 'venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.MAGENTO_BACKEND_EDITION).toBe('EE');
    process.env.MAGENTO_BACKEND_EDITION = old;
});

test('warns if braintreeToken does not match env', async () => {
    const old = process.env.CHECKOUT_BRAINTREE_TOKEN;
    process.env.CHECKOUT_BRAINTREE_TOKEN = '12345';
    fse.ensureDir.mockResolvedValueOnce(true);
    fse.readdir.mockResolvedValueOnce(true);
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            braintreeToken: '54321',
            name: 'goo',
            template: 'venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.CHECKOUT_BRAINTREE_TOKEN).not.toBe('54321');
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('Environment variable overrides!')
    );
    process.env.CHECKOUT_BRAINTREE_TOKEN = old;
});

test('does not warn if braintreeToken matches env', async () => {
    const old = process.env.CHECKOUT_BRAINTREE_TOKEN;
    process.env.CHECKOUT_BRAINTREE_TOKEN = '54321';
    fse.ensureDir.mockResolvedValueOnce(true);
    fse.readdir.mockResolvedValueOnce(true);
    await expect(
        createProjectCliBuilder.handler({
            backendUrl: 'https://example.com',
            braintreeToken: '54321',
            name: 'goo',
            template: 'venia-concept',
            directory: '/project',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(process.env.CHECKOUT_BRAINTREE_TOKEN).toBe('54321');
    process.env.CHECKOUT_BRAINTREE_TOKEN = old;
});

test('runs install with yarn', async () => {
    await expect(
        createProjectCliBuilder.handler({
            name: 'goo',
            template: 'venia-concept',
            directory: process.cwd(),
            install: true,
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(shell).toHaveBeenCalledWith('yarn install', expect.anything());
});

test('runs install with npm', async () => {
    await expect(
        createProjectCliBuilder.handler({
            name: 'goo',
            template: 'venia-concept',
            directory: process.cwd(),
            install: true,
            npmClient: 'npm'
        })
    ).resolves.not.toThrow();
    expect(shell).toHaveBeenCalledWith('npm install', expect.anything());
});

test('errors out on a bad npm package', async () => {
    repo.findTemplateDir.mockRejectedValueOnce(new Error('could not download'));
    await expect(
        createProjectCliBuilder.handler({
            name: 'package-name',
            template: 'bad template name',
            directory: '/project',
            install: true,
            npmClient: 'yarn'
        })
    ).rejects.toThrowErrorMatchingSnapshot();
});
