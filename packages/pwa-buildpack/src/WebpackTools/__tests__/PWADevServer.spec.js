jest.mock('../../util/promisified/dns');
jest.mock('../../util/promisified/openport');
jest.mock('../../util/global-config');
jest.mock('../../util/ssl-cert-store');
jest.mock('../../util/run-as-root');
jest.mock('../middlewares/DevProxy');
jest.mock('../middlewares/OriginSubstitution');
jest.mock('../middlewares/StaticRootRoute');

const { lookup } = require('../../util/promisified/dns');
const openport = require('../../util/promisified/openport');
const runAsRoot = require('../../util/run-as-root');
const GlobalConfig = require('../../util/global-config');
const SSLCertStore = require('../../util/ssl-cert-store');
const middlewares = {
    DevProxy: require('../middlewares/DevProxy'),
    OriginSubstitution: require('../middlewares/OriginSubstitution'),
    StaticRootRoute: require('../middlewares/StaticRootRoute')
};

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
    hostnameForNextId(name) {
        PWADevServer.hostnamesById.get.mockReturnValueOnce(name);
        return simulate;
    },
    noHostnameForNextId() {
        PWADevServer.hostnamesById.get.mockReturnValueOnce(undefined);
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

test('.findFreeHostname() makes a new hostname for an identifier', async () => {
    simulate.noPortSavedForNextHostname();
    const hostname = await PWADevServer.findFreeHostname('bar');
    expect(hostname).toBe('bar.local.pwadev');
});

test('.findFreeHostname() skips past taken hostnames for an identifier', async () => {
    const hostname = await PWADevServer.findFreeHostname('foo');
    expect(hostname).toBe('foo.local.pwadev');

    simulate
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .noPortSavedForNextHostname();

    const hostname2 = await PWADevServer.findFreeHostname('foo');
    expect(hostname2).toBe('foo3.local.pwadev');
});

test('.findFreeHostname() bails after 9 failed attempts', async () => {
    const hostname = await PWADevServer.findFreeHostname('foo');
    expect(hostname).toBe('foo.local.pwadev');

    simulate
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname()
        .portSavedForNextHostname();

    await expect(PWADevServer.findFreeHostname('foo')).rejects.toThrowError(
        `Unable to find a free hostname after`
    );
});

test('.provideDevHost() returns a URL object with a free dev host origin', async () => {
    simulate
        .noHostnameForNextId()
        .noPortSavedForNextHostname()
        .aFreePortWasFound(8765)
        .hostDoesNotResolve();

    await expect(PWADevServer.provideDevHost('woah')).resolves.toMatchObject({
        protocol: 'https:',
        hostname: 'woah.local.pwadev',
        port: 8765
    });
});

test('.provideDevHost() returns a URL object with a cached dev host origin', async () => {
    simulate
        .hostnameForNextId('cached-host.local.pwadev')
        .portSavedForNextHostname(8765)
        .hostResolvesLoopback();

    await expect(PWADevServer.provideDevHost('wat')).resolves.toMatchObject({
        protocol: 'https:',
        hostname: 'cached-host.local.pwadev',
        port: 8765
    });
});

test('.provideDevHost() throws if it got a reserved hostname but could not find a port for that hostname', async () => {
    simulate
        .hostnameForNextId('doomed-host.local.pwadev')
        .noPortSavedForNextHostname();

    await expect(PWADevServer.provideDevHost('dang')).rejects.toThrow(
        'Found no port matching the hostname'
    );
});

test('.configure() throws errors on missing config', async () => {
    await expect(PWADevServer.configure()).rejects.toThrow(
        'id must be of type string'
    );
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

test('.configure() gets or creates an SSL cert', async () => {
    simulate
        .hostnameForNextId('coolnewhost.local.pwadev')
        .portSavedForNextHostname(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey',
            cert: 'fakeCert'
        });
    const server = await PWADevServer.configure({
        id: 'heckin',
        paths: {
            output: 'good'
        },
        publicPath: 'bork',
        serviceWorkerFileName: 'doin',
        backendDomain: 'growe'
    });
    expect(SSLCertStore.provide).toHaveBeenCalled();
    expect(server.https).toHaveProperty('cert', 'fakeCert');
});

test('.configure() returns a configuration object for the `devServer` property of a webpack config', async () => {
    simulate
        .hostnameForNextId('coolnewhost.local.pwadev')
        .portSavedForNextHostname(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey2',
            cert: 'fakeCert2'
        });

    const config = {
        id: 'Theme_Unique_Id',
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
        host: 'coolnewhost.local.pwadev',
        port: 8765,
        publicPath:
            'https://coolnewhost.local.pwadev:8765/full/path/to/publicPath',
        before: expect.any(Function),
        after: expect.any(Function)
    });
});

test('.configure() returns a configuration object with before() and after() handlers that add middlewares in order', async () => {
    simulate
        .hostnameForNextId('coolnewhost.local.pwadev')
        .portSavedForNextHostname(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey2',
            cert: 'fakeCert2'
        });

    const config = {
        id: 'Theme_Unique_Id',
        paths: {
            output: 'path/to/static'
        },
        publicPath: 'full/path/to/publicPath',
        serviceWorkerFileName: 'swname.js',
        backendDomain: 'https://magento.backend.domain'
    };

    const devServer = await PWADevServer.configure(config);

    const app = {
        use: jest.fn()
    };

    middlewares.StaticRootRoute.mockReturnValueOnce('fakeStaticRootRoute');

    devServer.before(app);

    middlewares.DevProxy.mockReturnValueOnce('fakeDevProxy');

    devServer.after(app);

    expect(middlewares.DevProxy).toHaveBeenCalledWith(
        expect.objectContaining({
            target: 'https://magento.backend.domain'
        })
    );

    expect(middlewares.OriginSubstitution).not.toHaveBeenCalled();

    expect(app.use).toHaveBeenCalledWith('fakeDevProxy');

    expect(middlewares.StaticRootRoute).toHaveBeenCalledWith(
        'path/to/static/swname.js'
    );

    expect(app.use).toHaveBeenCalledWith('fakeStaticRootRoute');

    expect(app.use).toHaveBeenCalledWith(
        'full/path/to/publicPath',
        expect.any(Function)
    );
});

test('.configure() optionally adds OriginSubstitution middleware', async () => {
    simulate
        .hostnameForNextId('coolnewhost.local.pwadev')
        .portSavedForNextHostname(8765)
        .hostResolvesLoopback()
        .certExistsForNextHostname({
            key: 'fakeKey2',
            cert: 'fakeCert2'
        });

    const config = {
        id: 'Theme_Unique_Id',
        paths: {
            output: 'path/to/static'
        },
        publicPath: 'full/path/to/publicPath',
        serviceWorkerFileName: 'swname.js',
        backendDomain: 'https://magento.backend.domain',
        changeOrigin: true
    };

    const devServer = await PWADevServer.configure(config);

    const app = {
        use: jest.fn()
    };

    middlewares.OriginSubstitution.mockReturnValueOnce(
        'fakeOriginSubstitution'
    );
    middlewares.DevProxy.mockReturnValueOnce('fakeDevProxy');
    middlewares.StaticRootRoute.mockReturnValueOnce('fakeStaticRootRoute');

    devServer.before(app);

    expect(middlewares.OriginSubstitution).toHaveBeenCalledWith(
        expect.objectContaining({
            protocol: 'https:',
            hostname: 'magento.backend.domain'
        }),
        expect.objectContaining({
            protocol: 'https:',
            hostname: 'coolnewhost.local.pwadev',
            port: 8765
        })
    );

    expect(app.use).toHaveBeenCalledWith('fakeOriginSubstitution');
});
