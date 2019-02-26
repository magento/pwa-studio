jest.mock('devcert');

const FAKE_CWD = '/path/to/fake/cwd';

const pkgLocTest = FAKE_CWD + '/package.json';
const pkg = jest.fn();
jest.doMock(pkgLocTest, pkg, { virtual: true });
const devcert = require('devcert');
const { configureHost } = require('../');
const execa = require('execa');

const fakeCertPair = {
    key: Buffer.from('fakeKey'),
    cert: Buffer.from('fakeCert')
};

const simulate = {
    certCached() {
        devcert.configuredDomains
            .mockReturnValueOnce({
                includes: () => true
            })
            .mockReturnValueOnce({
                includes: () => true
            });
        devcert.certificateFor.mockResolvedValueOnce(fakeCertPair);
        return simulate;
    },
    certNotCached() {
        devcert.configuredDomains.mockReturnValueOnce([]);
    },
    certCreated() {
        devcert.configuredDomains
            .mockReturnValueOnce([])
            .mockReturnValueOnce([]);
        devcert.certificateFor.mockResolvedValueOnce(fakeCertPair);
        return simulate;
    },
    certFailed(message) {
        devcert.configuredDomains
            .mockReturnValueOnce([])
            .mockReturnValueOnce([]);
        devcert.certificateFor.mockRejectedValueOnce(new Error(message));
        return simulate;
    },
    certTimedOut() {
        createDeferred();
        devcert.certificateFor.mockReturnValueOnce(deferred);
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
        jest.resetModules();
        pkg.mockImplementationOnce(() => ({ name }));
        return simulate;
    }
};

// intercept and disable console output
beforeEach(() => {
    jest.spyOn(process, 'cwd');
    process.cwd.mockReturnValue(FAKE_CWD);
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(execa, 'shell').mockImplementation(() => Promise.resolve());
});

afterEach(() => {
    process.cwd.mockRestore();
    console.warn.mockRestore();
    execa.shell.mockRestore();
});

const hostRegex = (
    name = configureHost.DEFAULT_NAME,
    domain = configureHost.DEV_DOMAIN
) => new RegExp(`${name}\\-[\\w\\-]{4,5}\\.${domain}$`);

test('produces a secure domain, port set, and ssl cert from default name if no package.json is found', async () => {
    simulate.noPackageFound().certCached();

    const { hostname, ports, ssl } = await configureHost();
    expect(hostname).toMatch(hostRegex());
    expect(ports.development).toBeGreaterThanOrEqual(8000);
    expect(ports.development).toBeLessThan(9000);
    expect(ports.staging).toBeGreaterThanOrEqual(9000);
    expect(ports.staging).toBeLessThan(10000);
    expect(ssl).toMatchObject({
        cert: 'fakeCert',
        key: 'fakeKey'
    });
    expect(console.warn.mock.calls[0]).toMatchObject([
        expect.stringContaining('Could not autodetect'),
        expect.any(Error)
    ]);
    expect(devcert.certificateFor).toHaveBeenCalledTimes(1);

    // expect same port set per host
    simulate.noPackageFound().certCached();
    const { ports: secondPorts } = await configureHost();
    expect(secondPorts).toEqual(ports);
});

test('produces a secure domain with default name if package name is unusable', async () => {
    simulate.packageNameIs(undefined).certCached();

    const { hostname } = await configureHost();
    expect(hostname).toMatch(hostRegex());

    expect(console.warn.mock.calls[0]).toMatchObject([
        expect.stringContaining('Could not autodetect'),
        expect.any(Error)
    ]);
});

test('produces a secure domain from package name', async () => {
    simulate.packageNameIs('package-name-yay').certCached();
    const { hostname } = await configureHost();
    expect(hostname).toMatch(hostRegex('package-name-yay'));
});

test('produces a secure domain from custom subdomain', async () => {
    simulate.packageNameIs('package-name-yay').certCached();
    const { hostname } = await configureHost({
        subdomain: 'friends-of-desoto'
    });
    expect(hostname).toMatch(hostRegex('friends-of-desoto'));
    pkg.mockReset(); // because it was never called
});

test('produces a secure domain from custom subdomain without unique autogen', async () => {
    simulate.certCached();
    const { hostname } = await configureHost({
        subdomain: 'friends-of-desoto',
        addUniqueHash: false
    });
    expect(hostname).toMatch(
        new RegExp(`friends-of-desoto\\.${configureHost.DEV_DOMAIN}$`)
    );
});

test('autogenerates a secure domain without unique autogen', async () => {
    simulate.certCached().packageNameIs('bigdog');
    const { hostname } = await configureHost({
        addUniqueHash: false
    });
    expect(hostname).toMatch(
        new RegExp(`bigdog\\.${configureHost.DEV_DOMAIN}$`)
    );
});

test('produces a secure domain from exact domain provided', async () => {
    simulate.certCached();
    const { hostname } = await configureHost({
        exactDomain: 'gagh.biz'
    });
    expect(hostname).toBe('gagh.biz');
});

test('warns about sudo prompt if cert needs to be created', async () => {
    simulate.certCreated();
    const oldIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = true;
    await configureHost({ subdomain: 'best-boss-i-ever-had' });
    expect(console.warn).not.toHaveBeenCalled();
    simulate.certCreated();
    execa.shell.mockRejectedValueOnce(new Error('wat'));
    await configureHost({ subdomain: 'bar-none' });
    process.stdin.isTTY = oldIsTTY;
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('requires temporary administrative privileges')
    );
});

test('returns false if not already provisioned and non-interactive specified', async () => {
    simulate.certNotCached();
    expect(
        await configureHost({
            subdomain: 'no-prod-for-you',
            interactive: false
        })
    ).toBe(false);
});

test('fails informatively if devcert fails', async () => {
    simulate.certFailed();
    await expect(configureHost({ subdomain: 'uss.hood' })).rejects.toThrowError(
        'Could not setup development domain'
    );
});

test('fails if process is not connected to tty', async () => {
    simulate.certCreated();
    const oldIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = false;
    await expect(configureHost({ subdomain: 'uss.hood' })).rejects.toThrowError(
        'interactive'
    );
    process.stdin.isTTY = oldIsTTY;
});

test('fails after a timeout if devcert never fulfills', async () => {
    simulate.certNotCached();
    simulate.certNotCached();
    jest.useFakeTimers();
    const oldIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = true;
    let resolveHangingPromise;
    let promise = new Promise(resolve => (resolveHangingPromise = resolve));
    devcert.certificateFor.mockReturnValueOnce(promise);
    const certPromise = configureHost({ subdomain: 'no-hurry' });
    jest.advanceTimersByTime(35000);
    await expect(certPromise).rejects.toThrowError(
        'Timed out waiting for SSL certificate generation and trust.'
    );
    resolveHangingPromise();
    jest.useRealTimers();
    process.stdin.isTTY = oldIsTTY;
});
