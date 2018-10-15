jest.mock('portscanner');
jest.mock('../../Utilities/configureHost');

const portscanner = require('portscanner');
const configureHost = require('../../Utilities/configureHost');
const { PWADevServer } = require('../');

portscanner.findAPortNotInUse.mockResolvedValue(10001);

const simulate = {
    uniqueHostProvided(
        hostname = 'bork.bork.bork',
        port = 8001,
        ssl = { key: 'the chickie', cert: 'chop chop' }
    ) {
        configureHost.mockResolvedValueOnce({
            hostname,
            ports: {
                development: port
            },
            ssl
        });
        return simulate;
    },
    portIsFree() {
        portscanner.checkPortStatus.mockResolvedValueOnce('closed');
        return simulate;
    },
    portIsInUse() {
        portscanner.checkPortStatus.mockResolvedValueOnce('open');
        return simulate;
    }
};

beforeEach(() => jest.spyOn(console, 'warn').mockImplementation());
afterEach(() => console.warn.mockRestore());

test('.configure() returns a configuration object for the `devServer` property of a webpack config', async () => {
    const devServer = await PWADevServer.configure({
        publicPath: 'full/path/to/publicPath'
    });

    expect(devServer).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: '0.0.0.0',
        port: expect.any(Number),
        stats: expect.objectContaining({ all: false }),
        after: expect.any(Function)
    });

    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/avoid\s+ServiceWorker\s+collisions/m)
    );
});

test('.configure() creates a project-unique host if `provideSecureHost` is set', async () => {
    simulate.uniqueHostProvided().portIsFree();
    const server = await PWADevServer.configure({
        publicPath: 'bork',
        provideSecureHost: true
    });
    expect(server).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: 'bork.bork.bork',
        port: 8001,
        https: {
            key: 'the chickie',
            cert: 'chop chop',
            spdy: {
                protocols: ['http/1.1']
            }
        },
        publicPath: 'https://bork.bork.bork:8001/bork/'
    });
});

test('.configure() falls back to an open port if desired port is not available, and warns', async () => {
    simulate.uniqueHostProvided().portIsInUse();
    const server = await PWADevServer.configure({
        publicPath: 'bork',
        provideSecureHost: true
    });
    expect(server).toMatchObject({
        host: 'bork.bork.bork',
        port: 10001,
        https: {
            key: 'the chickie',
            cert: 'chop chop',
            spdy: {
                protocols: ['http/1.1']
            }
        },
        publicPath: 'https://bork.bork.bork:10001/bork/'
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/port\s+8001\s+is\s+in\s+use/m)
    );
});

test('.configure() is backwards compatible with "id" option, but warns', async () => {
    simulate.uniqueHostProvided('flappy.bird', 8002).portIsFree();
    const server = await PWADevServer.configure({
        publicPath: 'blorch',
        id: 'flappy'
    });
    expect(server).toMatchObject({
        host: 'flappy.bird',
        port: 8002,
        https: {
            key: 'the chickie',
            cert: 'chop chop',
            spdy: {
                protocols: ['http/1.1']
            }
        }
    });
    expect(configureHost).toHaveBeenCalledWith(
        expect.objectContaining({
            subdomain: 'flappy',
            addUniqueHash: false
        })
    );
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/option\s+is\s+deprecated/m)
    );
});

test('.configure() allows customization of provided host', async () => {
    simulate.uniqueHostProvided().portIsFree();
    await PWADevServer.configure({
        publicPath: 'bork',
        provideSecureHost: {
            exactDomain: 'flippy.bird'
        }
    });
    expect(configureHost).toHaveBeenCalledWith(
        expect.objectContaining({
            exactDomain: 'flippy.bird'
        })
    );
});

test('.configure() allows customization of provided host', async () => {
    simulate.uniqueHostProvided().portIsFree();
    await PWADevServer.configure({
        publicPath: 'bork',
        provideSecureHost: {
            exactDomain: 'flippy.bird'
        }
    });
    expect(configureHost).toHaveBeenCalledWith(
        expect.objectContaining({
            exactDomain: 'flippy.bird'
        })
    );
});

test('.configure() errors on bad "provideSecureHost" option', async () => {
    await expect(
        PWADevServer.configure({ publicPath: '/', provideSecureHost: () => {} })
    ).rejects.toThrowError('Unrecognized argument');
});

test('debugErrorMiddleware attached', async () => {
    const config = {
        publicPath: 'full/path/to/publicPath'
    };

    const devServer = await PWADevServer.configure(config);

    expect(devServer.after).toBeInstanceOf(Function);
    const app = {
        use: jest.fn()
    };
    devServer.after(app);
    expect(app.use).toHaveBeenCalledWith(expect.any(Function));
});
