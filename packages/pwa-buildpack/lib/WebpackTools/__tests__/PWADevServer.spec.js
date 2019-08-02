jest.mock('debug-error-middleware');
jest.mock('fs');
jest.mock('portscanner');
jest.mock('graphql-playground-middleware-express');
jest.mock('../../Utilities/configureHost');

const fs = require('fs');
jest.spyOn(fs, 'readFile');

const mockContext = require('path').resolve(__dirname, '../../../../../');

const debugErrorMiddleware = require('debug-error-middleware');
const waitForExpect = require('wait-for-expect');
const portscanner = require('portscanner');
const stripAnsi = require('strip-ansi');
const {
    default: playgroundMiddleware
} = require('graphql-playground-middleware-express');
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

beforeEach(() => {
    configureHost.mockReset();
    portscanner.checkPortStatus.mockReset();
    playgroundMiddleware.mockReset();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
});

afterEach(() => {
    console.warn.mockRestore();
    console.log.mockRestore();
});

test('.configure() returns a configuration object for the `devServer` property of a webpack config', async () => {
    const devServer = await PWADevServer.configure(mockContext, {
        publicPath: 'full/path/to/publicPath'
    });

    expect(devServer).toMatchObject({
        host: '0.0.0.0',
        port: expect.any(Number)
    });

    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/avoid\s+ServiceWorker\s+collisions/m)
    );
});

test('.configure() logs that a custom origin has not yet been created', async () => {
    const server = await PWADevServer.configure(mockContext, {
        publicPath: 'bork',
        customOrigin: {
            enabled: true
        }
    });
    expect(server).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: '0.0.0.0',
        port: 10001,
        publicPath: 'http://0.0.0.0:10001/bork/'
    });
});

test('.configure() creates a project-unique host if customOrigin config set in env', async () => {
    simulate.uniqueHostProvided().portIsFree();
    const server = await PWADevServer.configure(mockContext, {
        publicPath: 'bork',
        customOrigin: {
            enabled: true
        }
    });
    expect(server).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: 'bork.bork.bork',
        port: 8001,
        https: {
            key: 'the chickie',
            cert: 'chop chop'
        },
        publicPath: 'https://bork.bork.bork:8001/bork/'
    });
});

test('.configure() lets devServer.host override customOrigin.host', async () => {
    simulate.uniqueHostProvided().portIsFree();
    const server = await PWADevServer.configure(mockContext, {
        publicPath: 'bork',
        customOrigin: {
            enabled: true
        },
        devServer: {
            host: 'borque.borque',
            port: 8001
        }
    });
    expect(server).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: 'borque.borque',
        port: 8001,
        publicPath: 'http://borque.borque:8001/bork/'
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/overriding the custom hostname/)
    );
});
test('.configure() falls back to an open port if desired port is not available, and warns', async () => {
    simulate.uniqueHostProvided().portIsInUse();
    const server = await PWADevServer.configure(mockContext, {
        publicPath: 'bork',
        customOrigin: {
            enabled: true
        }
    });
    expect(server).toMatchObject({
        host: 'bork.bork.bork',
        port: 10001,
        https: {
            key: 'the chickie',
            cert: 'chop chop'
        },
        publicPath: 'https://bork.bork.bork:10001/bork/'
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/port\s+8001\s+is\s+in\s+use/m)
    );
});

test('.configure() allows customization of provided host', async () => {
    simulate.uniqueHostProvided().portIsFree();
    await PWADevServer.configure(mockContext, {
        publicPath: 'bork',
        customOrigin: {
            enabled: true,
            exactDomain: 'flippy.bird'
        }
    });
    expect(configureHost).toHaveBeenCalledWith(
        mockContext,
        expect.objectContaining({
            exactDomain: 'flippy.bird'
        })
    );
});

test('debugErrorMiddleware and notifier attached', async () => {
    const config = {
        publicPath: 'full/path/to/publicPath'
    };

    const debugMiddleware = () => {};
    debugErrorMiddleware.express.mockReturnValueOnce(debugMiddleware);

    const devServer = await PWADevServer.configure(mockContext, config);

    expect(devServer.after).toBeInstanceOf(Function);
    const app = {
        use: jest.fn()
    };
    const waitUntilValid = jest.fn();
    const server = {
        middleware: {
            waitUntilValid
        }
    };
    devServer.after(app, server);
    expect(app.use).toHaveBeenCalledWith(debugMiddleware);
    expect(waitUntilValid).toHaveBeenCalled();
    const [notifier] = waitUntilValid.mock.calls[0];
    expect(notifier).toBeInstanceOf(Function);
    notifier();
    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch('PWADevServer ready at');
});

test('graphql-playground middleware attached', async () => {
    const config = {
        publicPath: 'full/path/to/publicPath',
        graphqlPlayground: true
    };

    const mockFileContents = {
        'path/to/query.graphql': '{ foo { bar } }',
        'path/to/otherQuery.graphql': '{ foo { bar, baz } }'
    };
    fs.readFile.mockImplementation((p, opts, cb) =>
        cb(null, mockFileContents[p])
    );

    const middleware = jest.fn();
    playgroundMiddleware.mockReturnValueOnce(middleware);

    const devServer = await PWADevServer.configure(mockContext, config);

    expect(devServer.before).toBeInstanceOf(Function);
    const app = {
        get: jest.fn(),
        use: jest.fn()
    };
    const stats = {
        compilation: {
            fileDependencies: new Set([
                'path/to/module.js',
                'path/to/query.graphql',
                'path/to/otherModule.js',
                'path/to/otherQuery.graphql',
                'path/to/thirdModule.js'
            ])
        }
    };
    const compiler = {
        hooks: {
            done: {
                tap(name, callback) {
                    setImmediate(() => {
                        callback(stats);
                    });
                }
            }
        }
    };
    const waitUntilValid = jest.fn();
    const server = {
        middleware: {
            waitUntilValid,
            context: {
                compiler
            }
        }
    };
    devServer.before(app, server);
    await waitForExpect(() => {
        expect(app.get).toHaveBeenCalled();
    });
    const [endpoint, middlewareProxy] = app.get.mock.calls[0];
    expect(endpoint).toBe('/graphiql');
    expect(middlewareProxy).toBeInstanceOf(Function);
    const req = {};
    const res = {};
    middlewareProxy(req, res);
    await waitForExpect(() => {
        expect(playgroundMiddleware).toHaveBeenCalled();
    });
    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(playgroundMiddleware.mock.calls[0][0]).toMatchObject({
        endpoint: '/graphql',
        tabs: [
            {
                endpoint: '/graphql',
                name: 'path/to/query.graphql',
                query: '{ foo { bar } }'
            },
            {
                endpoint: '/graphql',
                name: 'path/to/otherQuery.graphql',
                query: '{ foo { bar, baz } }'
            }
        ]
    });
    expect(middleware).toHaveBeenCalledWith(req, res, expect.any(Function));
    devServer.after(app, server);
    expect(waitUntilValid).toHaveBeenCalled();
    const [notifier] = waitUntilValid.mock.calls[0];
    notifier();
    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch(/PWADevServer ready at/);
    expect(consoleOutput).toMatch(/GraphQL Playground ready at .+?\/graphiql/);
    middlewareProxy(req, res);
    expect(playgroundMiddleware).toHaveBeenCalledTimes(1);
});

test('graphql-playground middleware handles error during project query read', async () => {
    const config = {
        publicPath: 'full/path/to/publicPath',
        graphqlPlayground: true
    };

    fs.readFile.mockImplementation((p, opts, cb) =>
        cb(new Error(`ENOENT: ${p} not found`))
    );

    const middleware = jest.fn();
    playgroundMiddleware.mockReturnValueOnce(middleware);

    const devServer = await PWADevServer.configure(mockContext, config);

    expect(devServer.before).toBeInstanceOf(Function);
    const app = {
        get: jest.fn(),
        use: jest.fn()
    };
    const stats = {
        compilation: {
            fileDependencies: new Set([
                'path/to/module.js',
                'path/to/query.graphql',
                'path/to/otherModule.js',
                'path/to/otherQuery.graphql',
                'path/to/thirdModule.js'
            ])
        }
    };
    let readHook;
    const compiler = {
        hooks: {
            done: {
                tap(name, callback) {
                    readHook = callback;
                }
            }
        }
    };
    const waitUntilValid = jest.fn();
    const server = {
        middleware: {
            waitUntilValid,
            context: {
                compiler
            }
        }
    };
    devServer.before(app, server);
    await waitForExpect(() => {
        expect(app.get).toHaveBeenCalled();
        expect(readHook).toBeTruthy();
    });
    const middlewareProxy = app.get.mock.calls[0][1];
    const req = {};
    const res = {};
    readHook(stats);
    await expect(middlewareProxy(req, res)).rejects.toThrow('ENOENT');
});

test('.configure() allows a `public` override', async () => {
    const devServer = await PWADevServer.configure(mockContext, {
        publicPath: 'full/path/to/publicPath',
        devServer: {
            public: 'docker.local'
        }
    });

    expect(devServer).toMatchObject({
        publicPath: 'https://docker.local/'
    });
});
