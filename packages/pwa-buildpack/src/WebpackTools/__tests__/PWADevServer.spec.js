jest.mock('../../util/promisified/dns');
jest.mock('../../util/promisified/openport');
jest.mock('../../util/global-config');
jest.mock('../../util/run-as-root');

const { lookup } = require('../../util/promisified/dns');
const openport = require('../../util/promisified/openport');
const GlobalConfig = require('../../util/global-config');

let PWADevServer;
let setupDomain;
beforeAll(() => {
    GlobalConfig.mockImplementation(({ key }) => ({
        set: jest.fn(key),
        get: jest.fn(),
        values: jest.fn()
    }));
    setupDomain = require('../../Utilities/setupDomain');
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
        setupDomain.userCerts.get.mockResolvedValueOnce(pair);
    }
};

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
        id: 'flowk',
        provideSSLCert: true
    });
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
        port: 8765,
        publicPath: expect.stringMatching(
            /horton\-(\w){4,5}\.local.pwadev:8765\/full\/path\/to\/publicPath/
        )
    });
});

test('.configure() is backwards compatible with `id` param', async () => {
    simulate
        .portSavedForNextHostname(8765)
        .aFreePortWasFound(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey2',
            cert: 'fakeCert2'
        });

    const config = {
        id: 'samiam',
        paths: {
            output: 'path/to/static',
            assets: 'path/to/assets'
        },
        publicPath: 'full/path/to/publicPath',
        provideSSLCert: true,
        serviceWorkerFileName: 'swname.js',
        backendDomain: 'https://magento.backend.domain'
    };

    const devServer = await PWADevServer.configure(config);

    expect(devServer).toMatchObject({
        host: 'samiam.local.pwadev',
        publicPath: 'https://samiam.local.pwadev:8765/full/path/to/publicPath'
    });
});

test('.configure() reluctantly handles unsecure http', async () => {
    simulate
        .portSavedForNextHostname(8765)
        .aFreePortWasFound(8765)
        .hostResolvesLoopback();

    const config = {
        https: false,
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
        host: 'samiam.local.pwadev',
        publicPath: 'http://samiam.local.pwadev:8765/full/path/to/publicPath'
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

test('debugErrorMiddleware attached', async () => {
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

    expect(devServer.after).toBeInstanceOf(Function);
    const app = {
        use: jest.fn()
    };
    devServer.after(app);
    expect(app.use).toHaveBeenCalledWith(expect.any(Function));
});
