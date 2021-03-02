jest.mock('errorhandler');
jest.mock('portscanner');
jest.mock('graphql-playground-middleware-express');
jest.mock('../../Utilities/configureHost');

const errorhandler = require('errorhandler');
const waitForExpect = require('wait-for-expect');
const portscanner = require('portscanner');
const stripAnsi = require('strip-ansi');
const {
    default: playgroundMiddleware
} = require('graphql-playground-middleware-express');
const configureHost = require('../../Utilities/configureHost');
const { PWADevServer } = require('../');

jest.mock('compression', () => () =>
    jest.fn().mockName('compression middleware')
);

jest.mock('hastily', () => ({
    HASTILY_STREAMABLE_PATH_REGEXP: 'HASTILY_STREAMABLE_PATH_REGEXP'
}));

portscanner.findAPortNotInUse.mockResolvedValue(10001);

const mockConfig = () => ({
    context: require('path').resolve(__dirname, '../../../../../'),
    output: {
        path: 'src',
        publicPath: '/bork/'
    }
});

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

const listeningApp = {
    address() {
        return {
            address: '0.0.0.0',
            port: 8000
        };
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

test('.configure() adds `devServer` and plugins to webpack config', async () => {
    const config = mockConfig();
    config.plugins = [];
    await PWADevServer.configure({}, config);

    expect(config.devServer).toMatchObject({
        host: '0.0.0.0',
        port: expect.any(Number)
    });

    expect(config.plugins.length).toBeGreaterThan(0);
});

test('.configure() logs that a custom origin has not yet been created', async () => {
    const config = mockConfig();
    await PWADevServer.configure(
        {
            customOrigin: {
                enabled: true
            }
        },
        config
    );
    expect(config.devServer).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: '0.0.0.0',
        port: 10001
    });
});

test('.configure() creates a project-unique host if customOrigin config set in env', async () => {
    const config = mockConfig();
    simulate.uniqueHostProvided().portIsFree();
    await PWADevServer.configure(
        {
            customOrigin: {
                enabled: true
            }
        },
        config
    );
    expect(config.devServer).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: 'bork.bork.bork',
        port: 8001,
        https: {
            key: 'the chickie',
            cert: 'chop chop'
        }
    });
});

test('.configure() lets devServer.host override customOrigin.host', async () => {
    simulate.uniqueHostProvided().portIsFree();
    const config = mockConfig();
    const server = await PWADevServer.configure(
        {
            customOrigin: {
                enabled: true
            },
            devServer: {
                host: 'borque.borque',
                port: 8001
            }
        },
        config
    );
    expect(server).toMatchObject({
        contentBase: false,
        compress: true,
        hot: true,
        host: 'borque.borque',
        port: 8001
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/overriding the custom hostname/)
    );
});
test('.configure() falls back to an open port if desired port is not available, and warns', async () => {
    simulate.uniqueHostProvided().portIsInUse();
    const config = mockConfig();
    await PWADevServer.configure(
        {
            customOrigin: {
                enabled: true
            }
        },
        config
    );
    expect(config.devServer).toMatchObject({
        host: 'bork.bork.bork',
        port: 10001,
        https: {
            key: 'the chickie',
            cert: 'chop chop'
        }
    });
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/port\s+8001\s+is\s+in\s+use/m)
    );
});

test('.configure() allows customization of provided host', async () => {
    const config = mockConfig();
    simulate.uniqueHostProvided().portIsFree();
    await PWADevServer.configure(
        {
            customOrigin: {
                enabled: true,
                exactDomain: 'flippy.bird'
            }
        },
        config
    );
    expect(configureHost).toHaveBeenCalledWith(
        expect.objectContaining({
            dir: config.context,
            exactDomain: 'flippy.bird'
        })
    );
});

test('debugErrorMiddleware and notifier attached', async () => {
    const config = mockConfig();
    config.publicPath = 'full/path/to/publicPath';

    const debugMiddleware = () => {};
    errorhandler.mockReturnValueOnce(debugMiddleware);

    await PWADevServer.configure({}, config);

    expect(config.devServer.after).toBeInstanceOf(Function);
    const app = {
        use: jest.fn()
    };
    const waitUntilValid = jest.fn();
    const server = {
        listeningApp,
        middleware: {
            waitUntilValid
        }
    };
    config.devServer.after(app, server);
    expect(app.use).toHaveBeenCalledWith(debugMiddleware);
    expect(waitUntilValid).toHaveBeenCalled();
    const [notifier] = waitUntilValid.mock.calls[0];
    expect(notifier).toBeInstanceOf(Function);
    notifier();
    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch('PWADevServer ready at');
});

test('graphql-playground middleware attached', async () => {
    const config = mockConfig();

    const middleware = jest.fn();
    playgroundMiddleware.mockReturnValueOnce(middleware);

    await PWADevServer.configure(
        {
            graphqlPlayground: true
        },
        config
    );

    expect(config.devServer.before).toBeInstanceOf(Function);
    const app = {
        get: jest.fn(),
        use: jest.fn()
    };
    const compilerStatsData = {
        compilation: {
            fileDependencies: new Set([
                'path/to/module.js',
                'path/to/otherModule.js',
                'path/to/thirdModule.js'
            ])
        }
    };
    const compiler = {
        hooks: {
            done: {
                tap(name, callback) {
                    setImmediate(() => {
                        callback(compilerStatsData);
                    });
                }
            }
        }
    };
    const waitUntilValid = jest.fn();
    const server = {
        listeningApp,
        middleware: {
            waitUntilValid,
            context: {
                compiler
            }
        }
    };
    config.devServer.before(app, server);
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
    expect(playgroundMiddleware.mock.calls[0][0]).toMatchObject({
        endpoint: '/graphql'
    });
    expect(middleware).toHaveBeenCalledWith(req, res, expect.any(Function));
    config.devServer.after(app, server);
    expect(waitUntilValid).toHaveBeenCalled();
    const [notifier] = waitUntilValid.mock.calls[0];
    notifier();
    const consoleOutput = stripAnsi(console.log.mock.calls[0][0]);
    expect(consoleOutput).toMatch(/PWADevServer ready at/);
    expect(consoleOutput).toMatch(/GraphQL Playground ready at .+?\/graphiql/);
    middlewareProxy(req, res);
    expect(playgroundMiddleware).toHaveBeenCalledTimes(1);
});

test('compression middleware to be attached if env.ENABLE_EXPRESS_SERVER_COMPRESSION is true', async () => {
    process.env.ENABLE_EXPRESS_SERVER_COMPRESSION = 'true';
    const config = mockConfig();

    const middleware = jest.fn();
    playgroundMiddleware.mockReturnValueOnce(middleware);

    await PWADevServer.configure(
        {
            graphqlPlayground: true
        },
        config
    );
    const use = jest.fn();
    const app = {
        get: jest.fn(),
        use
    };
    const compilerStatsData = {
        compilation: {
            fileDependencies: new Set([
                'path/to/module.js',
                'path/to/otherModule.js',
                'path/to/thirdModule.js'
            ])
        }
    };
    const compiler = {
        hooks: {
            done: {
                tap(name, callback) {
                    setImmediate(() => {
                        callback(compilerStatsData);
                    });
                }
            }
        }
    };
    const waitUntilValid = jest.fn();
    const server = {
        listeningApp,
        middleware: {
            waitUntilValid,
            context: {
                compiler
            }
        }
    };
    config.devServer.before(app, server);

    expect(use.mock.calls).toMatchSnapshot();
});

test('compression middleware should not be attached if env.ENABLE_EXPRESS_SERVER_COMPRESSION is false', async () => {
    process.env.ENABLE_EXPRESS_SERVER_COMPRESSION = 'false';
    const config = mockConfig();

    const middleware = jest.fn();
    playgroundMiddleware.mockReturnValueOnce(middleware);

    await PWADevServer.configure(
        {
            graphqlPlayground: true
        },
        config
    );
    const use = jest.fn();
    const app = {
        get: jest.fn(),
        use
    };
    const compilerStatsData = {
        compilation: {
            fileDependencies: new Set([
                'path/to/module.js',
                'path/to/otherModule.js',
                'path/to/thirdModule.js'
            ])
        }
    };
    const compiler = {
        hooks: {
            done: {
                tap(name, callback) {
                    setImmediate(() => {
                        callback(compilerStatsData);
                    });
                }
            }
        }
    };
    const waitUntilValid = jest.fn();
    const server = {
        listeningApp,
        middleware: {
            waitUntilValid,
            context: {
                compiler
            }
        }
    };
    config.devServer.before(app, server);

    expect(use.mock.calls).toMatchSnapshot();
});
