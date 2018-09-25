jest.mock('../../util/promisified/dns');
jest.mock('../../util/promisified/openport');
jest.mock('../../util/global-config');
jest.mock('../../util/ssl-cert-store');
jest.mock('../../util/run-as-root');

const { lookup } = require('../../util/promisified/dns');
const openport = require('../../util/promisified/openport');
const runAsRoot = require('../../util/run-as-root');
const GlobalConfig = require('../../util/global-config');
const SSLCertStore = require('../../util/ssl-cert-store');
// Mocking a variable path requires the `.doMock`
const pkgLocTest = process.cwd() + '/package.json';
const pkg = jest.fn();
jest.doMock(pkgLocTest, pkg, { virtual: true });

let PWADevServer;
beforeAll(() => {
    GlobalConfig.mockImplementation(({ key }) => ({
        set: jest.fn(key),
        get: jest.fn(),
        values: jest.fn()
    }));
    PWADevServer = require('../').PWADevServer;
});

const simulate = {
    hostResolvesLoopback({ family = 4 } = {}) {
        lookup.mockReturnValueOnce({
            address: family === 6 ? '::1' : '127.0.0.1',
            family
        });
        return simulate;
    },
    hostDoesNotResolve() {
        lookup.mockRejectedValueOnce({ code: 'ENOTFOUND' });
        return simulate;
    },
    noPortSavedForNextHostname() {
        PWADevServer.portsByHostname.get.mockReturnValueOnce(undefined);
        return simulate;
    },
    portSavedForNextHostname(n = 8000) {
        PWADevServer.portsByHostname.get.mockReturnValueOnce(n);
        return simulate;
    },
    savedPortsAre(...ports) {
        PWADevServer.portsByHostname.values.mockReturnValueOnce(ports);
        return simulate;
    },
    aFreePortWasFound(n = 8000) {
        openport.find.mockResolvedValueOnce(n);
        return simulate;
    },
    certExistsForNextHostname(pair) {
        SSLCertStore.provide.mockResolvedValueOnce(pair);
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

test('.setLoopback() checks if hostname resolves local, ipv4 or 6', async () => {
    simulate.hostResolvesLoopback();
    await PWADevServer.setLoopback('excelsior.com');
    expect(lookup).toHaveBeenCalledWith('excelsior.com');
    expect(runAsRoot).not.toHaveBeenCalled();

    simulate.hostResolvesLoopback({ family: 6 });
    await PWADevServer.setLoopback('excelsior.com');
    expect(runAsRoot).not.toHaveBeenCalled();
});

test('.setLoopback() updates /etc/hosts to make hostname local', async () => {
    lookup.mockRejectedValueOnce({ code: 'ENOTFOUND' });
    await PWADevServer.setLoopback('excelsior.com');
    expect(runAsRoot).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function),
        'excelsior.com'
    );
});

test('.setLoopback() dies under mysterious circumstances', async () => {
    lookup.mockRejectedValueOnce({ code: 'UNKNOWN' });
    await expect(PWADevServer.setLoopback('excelsior.com')).rejects.toThrow(
        'Error trying to check'
    );
});

test('.findFreePort() uses openPort to get a free port', async () => {
    simulate.savedPortsAre(8543, 9002, 8765).aFreePortWasFound();

    await PWADevServer.findFreePort();
    expect(openport.find).toHaveBeenCalledWith(
        expect.objectContaining({
            avoid: expect.arrayContaining([8543, 9002, 8765])
        })
    );
});

test('.findFreePort() passes formatted errors from port lookup', async () => {
    openport.find.mockRejectedValueOnce('woah');

    await expect(PWADevServer.findFreePort()).rejects.toThrowError(
        /Unable to find an open port.*woah/
    );
});

test('.getUniqueSubdomain() makes a new hostname for an identifier', async () => {
    const hostname = await PWADevServer.getUniqueSubdomain('bar');
    expect(hostname).toMatch(/bar\-(\w){4,5}/);
});

test('.getUniqueSubdomain() makes a new hostname from the local package name', async () => {
    simulate.packageNameIs('lorax');

    const hostname = await PWADevServer.getUniqueSubdomain();
    expect(hostname).toMatch(/lorax\-(\w){4,5}/);
});

test('.getUniqueSubdomain() logs a warning if it cannot determine a name', async () => {
    jest.spyOn(console, 'warn').mockImplementation();
    simulate.packageNameIs(undefined);

    const hostname = await PWADevServer.getUniqueSubdomain();
    expect(hostname).toMatch(/my\-pwa\-(\w){4,5}/);
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('Could not autodetect'),
        expect.any(Error)
    );
    expect(console.warn.mock.calls[0][1].message).toMatchSnapshot();

    // and even if package cannot be found:
    simulate.noPackageFound();
    await PWADevServer.getUniqueSubdomain();
    expect(console.warn).toHaveBeenLastCalledWith(
        expect.stringMatching('Could not autodetect'),
        expect.any(Error)
    );
    expect(console.warn.mock.calls[1][1].code).toBe('ENOTFOUND');
    console.warn.mockRestore();
});

test('.provideUniqueHost() returns a URL object with a free dev host origin and stores a port', async () => {
    simulate
        .noPortSavedForNextHostname()
        .aFreePortWasFound(8765)
        .hostDoesNotResolve();

    const { protocol, hostname, port } = await PWADevServer.provideUniqueHost(
        'woah'
    );

    expect(protocol).toBe('https:');
    expect(hostname).toMatch(/woah\-(\w){4,5}\.local\.pwadev/);
    expect(port).toBe(8765);

    expect(PWADevServer.portsByHostname.get).toHaveBeenCalledWith(hostname);
    expect(PWADevServer.portsByHostname.set).toHaveBeenCalledWith(
        hostname,
        port
    );
});

test('.provideUniqueHost() returns a cached port for the hostname', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation();
    simulate
        .portSavedForNextHostname(8000)
        .aFreePortWasFound(8776)
        .hostResolvesLoopback();

    const { port } = await PWADevServer.provideUniqueHost('woah');

    expect(port).toBe(8776);
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(
            'port 8000 is in use. The dev server will instead run'
        )
    );
    warn.mockRestore();
});

test('.provideUniqueHost() warns about reserved port conflict', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation();
    simulate
        .portSavedForNextHostname(8888)
        .aFreePortWasFound(8889)
        .hostResolvesLoopback();

    const { port } = await PWADevServer.provideUniqueHost('woah');

    expect(port).toBe(8889);

    warn.mockRestore();
});

test('.configure() throws errors on missing config', async () => {
    await expect(PWADevServer.configure({ id: 'foo' })).rejects.toThrow(
        'publicPath must be of type string'
    );
    await expect(
        PWADevServer.configure({ id: 'foo', publicPath: 'bar' })
    ).rejects.toThrow('backendDomain must be of type string');
    await expect(
        PWADevServer.configure({
            id: 'foo',
            publicPath: 'bar',
            backendDomain: 'https://dumb.domain',
            paths: {}
        })
    ).rejects.toThrow('paths.output must be of type string');
    await expect(
        PWADevServer.configure({
            id: 'foo',
            publicPath: 'bar',
            backendDomain: 'https://dumb.domain',
            paths: { output: 1234 }
        })
    ).rejects.toThrow('paths.output must be of type string');
    await expect(
        PWADevServer.configure({
            id: 'foo',
            publicPath: 'bar',
            backendDomain: 'https://dumb.domain',
            paths: { output: 'foo' }
        })
    ).rejects.toThrow('serviceWorkerFileName must be of type string');
});

test('.configure() gets or creates an SSL cert if `provideSSLCert: true`', async () => {
    simulate
        .portSavedForNextHostname(8765)
        .aFreePortWasFound(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey',
            cert: 'fakeCert'
        });
    const server = await PWADevServer.configure({
        paths: {
            output: 'good'
        },
        publicPath: 'bork',
        serviceWorkerFileName: 'doin',
        backendDomain: 'growe',
        provideSSLCert: true
    });
    expect(SSLCertStore.provide).toHaveBeenCalled();
    expect(server.https).toHaveProperty('cert', 'fakeCert');
});

test('.configure() returns a configuration object for the `devServer` property of a webpack config', async () => {
    simulate
        .portSavedForNextHostname(8765)
        .aFreePortWasFound(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey2',
            cert: 'fakeCert2'
        });

    const config = {
        provideUniqueHost: 'horton',
        provideSSLCert: true,
        paths: {
            output: 'path/to/static'
        },
        publicPath: 'full/path/to/publicPath',
        serviceWorkerFileName: 'swname.js',
        backendDomain: 'https://magento.backend.domain'
    };

    const devServer = await PWADevServer.configure(config);

    expect(devServer).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        https: {
            key: 'fakeKey2',
            cert: 'fakeCert2'
        },
        host: expect.stringMatching(/horton\-(\w){4,5}\.local\.pwadev/),
        port: 8765
    });
});

test('.configure() is backwards compatible with `id` param', async () => {
    simulate
        .portSavedForNextHostname(8765)
        .aFreePortWasFound(8765)
        .hostResolvesLoopback();

    const config = {
        id: 'samiam',
        paths: {
            output: 'path/to/static',
            assets: 'path/to/assets'
        },
        publicPath: 'full/path/to/publicPath',
        serviceWorkerFileName: 'swname.js',
        backendDomain: 'https://magento.backend.domain'
    };

    const devServer = await PWADevServer.configure(config);

    expect(devServer).toMatchObject({
        host: 'samiam.local.pwadev'
    });
});

test('.configure() `id` param overrides `provideUniqueHost` param', async () => {
    simulate
        .portSavedForNextHostname(8765)
        .aFreePortWasFound(8765)
        .hostResolvesLoopback();

    const config = {
        id: 'samiam',
        provideUniqueHost: 'samiam',
        paths: {
            output: 'path/to/static',
            assets: 'path/to/assets'
        },
        publicPath: 'full/path/to/publicPath',
        serviceWorkerFileName: 'swname.js',
        backendDomain: 'https://magento.backend.domain'
    };

    const devServer = await PWADevServer.configure(config);

    expect(devServer).toMatchObject({
        host: 'samiam.local.pwadev'
    });
});
