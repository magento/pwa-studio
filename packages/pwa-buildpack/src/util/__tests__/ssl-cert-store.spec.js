jest.mock('../promisified/child_process');
jest.mock('../run-as-root');
jest.mock('../global-config');

const GlobalConfig = require('../global-config');
const { exec } = require('../promisified/child_process');
const runAsRoot = require('../run-as-root');

let SSLCertStore;
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
    SSLCertStore = require('../ssl-cert-store');
});
afterAll(() => GlobalConfig.mockRestore());

test('static async expired(cert) uses openssl to test whether a cert has expired or is expiring', async () => {
    exec.mockRejectedValueOnce({
        stdout: '\nCertificate will expire\n'
    });
    const shouldBeTrue = await SSLCertStore.expired('fakeCert');
    expect(exec).toHaveBeenCalledWith(
        'openssl x509 -checkend 0 <<< "fakeCert"'
    );
    expect(shouldBeTrue).toBe(true);

    exec.mockResolvedValueOnce(null);
    const shouldBeFalse = await SSLCertStore.expired('fakeCert');
    expect(shouldBeFalse).toBe(false);

    exec.mockRejectedValueOnce({
        stdout: 'Some other value'
    });
    const shouldStillBeFalse = await SSLCertStore.expired('fakeCert');
    expect(shouldStillBeFalse).toBe(false);
});

test('static async provide() throws on a non-string', async () => {
    await expect(SSLCertStore.provide(null)).rejects.toThrowError(
        'Must provide a commonName'
    );
});

test('static async provide() gets a valid cached cert', async () => {
    exec.mockResolvedValueOnce(null);
    SSLCertStore.userCerts.get.mockResolvedValueOnce({
        cert: 'cachedCert',
        key: 'cachedKey'
    });
    await expect(SSLCertStore.provide('example.com')).resolves.toMatchObject({
        cert: 'cachedCert',
        key: 'cachedKey'
    });
});

test('static async provide() deletes and recreates an expired cert', async () => {
    SSLCertStore.userCerts.get.mockResolvedValueOnce({
        cert: 'expiredCert',
        key: 'expiredKey'
    });
    exec.mockRejectedValueOnce({ stdout: 'Certificate will expire' });
    runAsRoot.mockResolvedValueOnce(
        '{ "key": "refreshedKey", "cert": "refreshedCert" }'
    );
    await expect(SSLCertStore.provide('example.com')).resolves.toMatchObject({
        cert: 'refreshedCert',
        key: 'refreshedKey'
    });
});

test('static async provide() creates a cert for a fresh domain', async () => {
    SSLCertStore.userCerts.get.mockRestore();
    runAsRoot.mockImplementationOnce(() => {
        return Promise.resolve('{ "key": "newKey", "cert": "newCert" }');
    });
    // and again with no cert, not even an expired one
    await expect(SSLCertStore.provide('existing.com')).resolves.toMatchObject({
        cert: 'newCert',
        key: 'newKey'
    });
});

test('static async create() throws a formatted error if the root call did not work', async () => {
    runAsRoot.mockRejectedValueOnce('');
    await expect(SSLCertStore.provide('example.com')).rejects.toThrowError(
        /generating dev cert/
    );
});
