jest.mock('../../util/promisified/child_process');
jest.mock('../../util/run-as-root');
jest.mock('../../util/global-config');
jest.mock('../../util/check-loopback');

const { exec } = require('../../util/promisified/child_process');
const runAsRoot = require('../../util/run-as-root');
const GlobalConfig = require('../../util/global-config');
const checkLoopback = require('../../util/check-loopback');

const pkgLocTest = process.cwd() + '/package.json';
const pkg = jest.fn();
jest.doMock(pkgLocTest, pkg, { virtual: true });
let setupDomain;

const simulate = {
    loopsBack() {
        checkLoopback.mockImplementationOnce(domains => new Set(domains));
        return simulate;
    },
    certExists(pair = { key: 'fake', cert: 'fake' }) {
        setupDomain.userCerts.get.mockResolvedValueOnce(pair);
        return simulate;
    },
    certCreated(pair = { key: 'fake', cert: 'fake' }) {
        runAsRoot.mockResolvedValueOnce(JSON.stringify([pair]));
        return simulate;
    },
    noPackageFound() {
        jest.resetModuleRegistry();
        pkg.mockImplementationOnce(() => {
            const error = new Error(process.cwd() + '/package.json not found');
            error.code = error.errno = 'ENOTFOUND';
            throw error;
        });
        return simulate;
    },
    packageNameIs(name) {
        jest.resetModuleRegistry();
        pkg.mockImplementationOnce(() => ({ name }));
        return simulate;
    }
};

beforeAll(() => {
    GlobalConfig.mockImplementation(({ key }) => ({
        set: jest.fn((...args) => {
            const keyParts = args.slice(0, -1);
            expect(typeof key(...keyParts)).toBe('string');
        }),
        get: jest.fn(),
        values: jest.fn(),
        del: jest.fn()
    }));
    exec.mockResolvedValue('');
    checkLoopback.mockResolvedValue(new Set());
    ({ setupDomain } = require('../'));
});
afterAll(() => GlobalConfig.mockRestore());

test('produces a secure domain and ssl cert from default name', async () => {
    jest.spyOn(console, 'warn').mockImplementation();
    simulate.noPackageFound().certCreated({
        cert: 'fakeCert',
        key: 'fakeKey'
    });
    const { hostname, certPair } = await setupDomain();
    expect(hostname).toMatch(
        new RegExp(
            `${setupDomain.DEFAULT_NAME}\\-\\w{4,5}\\.${
                setupDomain.DEV_DOMAIN
            }$`
        )
    );
    expect(certPair).toMatchObject({
        cert: 'fakeCert',
        key: 'fakeKey'
    });
    expect(console.warn.mock.calls[0]).toMatchObject([
        expect.stringContaining('Could not autodetect'),
        expect.any(Error)
    ]);
    expect(runAsRoot).toHaveBeenCalledTimes(1);
    expect(runAsRoot).toHaveBeenCalledWith(
        expect.stringMatching(/./),
        expect.any(Function),
        expect.arrayContaining([hostname]),
        expect.arrayContaining([hostname])
    );
    console.warn.mockRestore();
});

test('produces a secure domain with default name if package name is unusable', async () => {
    jest.spyOn(console, 'warn').mockImplementation();
    simulate
        .packageNameIs(undefined)
        .loopsBack()
        .certCreated();
    const { hostname } = await setupDomain();
    expect(hostname).toMatch(
        new RegExp(
            `${setupDomain.DEFAULT_NAME}\\-\\w{4,5}\\.${
                setupDomain.DEV_DOMAIN
            }$`
        )
    );

    expect(console.warn.mock.calls[0]).toMatchObject([
        expect.stringContaining('Could not autodetect'),
        expect.any(Error)
    ]);

    console.warn.mockRestore();
});

test('produces a secure domain from package name', async () => {
    jest.spyOn(console, 'warn').mockImplementation();
    simulate
        .packageNameIs('package-name-yay')
        .loopsBack()
        .certCreated();
    const { hostname } = await setupDomain();
    expect(hostname).toMatch(
        new RegExp(`package-name-yay-\\w{4,5}\\.${setupDomain.DEV_DOMAIN}$`)
    );
});

test('produces a secure domain from custom name', async () => {
    simulate
        .packageNameIs('package-name-yay')
        .loopsBack()
        .certCreated();
    const { hostname } = await setupDomain('custom-912');
    expect(hostname).toMatch(
        new RegExp(`custom-912-\\w{4,5}\\.${setupDomain.DEV_DOMAIN}$`)
    );
});

test('produces a secure domain without unique autogen', async () => {
    simulate.loopsBack().certCreated();
    const { hostname } = await setupDomain('custom-823', { unique: false });
    expect(hostname).toMatch(
        new RegExp(`custom-823\\.${setupDomain.DEV_DOMAIN}$`)
    );
});

test('produces an unsecure domain', async () => {
    simulate.loopsBack();
    const { certPair } = await setupDomain('custom-823', { secure: false });
    expect(certPair).toBeFalsy();
    expect(setupDomain.userCerts.get).not.toHaveBeenCalled();
});

test('returns an already-set-up secure domain', async () => {
    simulate.loopsBack().certExists({
        key: 'no',
        cert: 'diggity'
    });
    const { certPair } = await setupDomain('custom-823', { unique: false });
    expect(certPair).toMatchObject({
        key: 'no',
        cert: 'diggity'
    });
    expect(runAsRoot).not.toHaveBeenCalled();
});

test('refreshes an expired cert', async () => {
    exec.mockRejectedValueOnce({ stdout: 'Certificate will expire' });
    simulate
        .loopsBack()
        .certExists({
            key: 'no',
            cert: 'diggity'
        })
        .certCreated({
            key: 'yes',
            cert: 'diggity'
        });
    const { certPair } = await setupDomain('custom-823', { unique: false });
    expect(certPair).toMatchObject({
        key: 'yes',
        cert: 'diggity'
    });
});

test('passes errors from denied root or bad parse', async () => {
    runAsRoot.mockRejectedValueOnce(new Error('Denied!'));
    await expect(setupDomain('blurg')).rejects.toThrowError('Denied!');
});

test('does a dry run to indicate readiness', async () => {
    simulate.loopsBack().certExists();
    expect(await setupDomain('woo', { dryRun: true })).toMatchObject({
        makeCerts: [],
        setLoopbacks: [],
        ready: true
    });

    simulate.loopsBack();
    expect(await setupDomain('woo', { dryRun: true })).toMatchObject({
        makeCerts: [expect.stringContaining('woo')],
        setLoopbacks: [],
        ready: false
    });

    simulate.certExists();
    expect(await setupDomain('woo', { dryRun: true })).toMatchObject({
        makeCerts: [],
        setLoopbacks: [expect.stringContaining('woo')],
        ready: false
    });

    simulate.loopsBack();
    expect(
        await setupDomain('woo', { dryRun: true, secure: false })
    ).toMatchObject({
        makeCerts: [],
        setLoopbacks: [],
        ready: true
    });
});
