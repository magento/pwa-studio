require('dotenv').config();
const debug = require('../util/debug').makeFileLogger(__filename);
const debugErrorMiddleware = require('debug-error-middleware').express;
const {
    default: playgroundMiddleware
} = require('graphql-playground-middleware-express');
const url = require('url');
const optionsValidator = require('../util/options-validator');
const chalk = require('chalk');
const configureHost = require('../Utilities/configureHost');
const portscanner = require('portscanner');
const { readFile: readFileAsync } = require('fs');
const { promisify } = require('util');
const readFile = promisify(readFileAsync);
const { relative } = require('path');
const boxen = require('boxen');
const addImgOptMiddleware = require('../Utilities/addImgOptMiddleware');

const secureHostWarning = chalk.redBright(`
    To enable all PWA features and avoid ServiceWorker collisions, PWA Studio
    highly recommends using the ${chalk.whiteBright(
        '"provideSecureHost"'
    )} configuration
    option of PWADevServer.
`);

const helpText = `
    To autogenerate a unique host based on project name
    and location on disk, simply add:
    ${chalk.whiteBright('provideSecureHost: true')}
    to PWADevServer configuration options.

    More options for this feature are described in documentation.
`;

const PWADevServer = {
    validateConfig: optionsValidator('PWADevServer', {
        publicPath: 'string',
        env: 'object'
    }),
    async configure(config) {
        debug('configure() invoked', config);
        PWADevServer.validateConfig('.configure(config)', config);
        const devServerConfig = {
            public: process.env.PWA_STUDIO_PUBLIC_PATH || '',
            contentBase: false, // UpwardPlugin serves static files
            compress: true,
            hot: true,
            watchOptions: {
                // polling is CPU intensive - provide the option to turn it on if needed
                poll:
                    !!parseInt(
                        process.env.PWA_STUDIO_HOT_RELOAD_WITH_POLLING
                    ) || false
            },
            host: '0.0.0.0',
            port:
                process.env.PWA_STUDIO_PORTS_DEVELOPMENT ||
                (await portscanner.findAPortNotInUse(10000)),
            stats: {
                all: !process.env.NODE_DEBUG ? false : undefined,
                builtAt: true,
                colors: true,
                errors: true,
                errorDetails: true,
                moduleTrace: true,
                timings: true,
                version: true,
                warnings: true
            },
            after(app, server) {
                app.use(debugErrorMiddleware());
                let readyNotice = chalk.green(
                    `PWADevServer ready at ${chalk.greenBright.underline(
                        devServerConfig.publicPath
                    )}`
                );
                if (config.graphqlPlayground) {
                    readyNotice +=
                        '\n' +
                        chalk.blueBright(
                            `GraphQL Playground ready at ${chalk.blueBright.underline(
                                new url.URL(
                                    '/graphiql',
                                    devServerConfig.publicPath
                                )
                            )}`
                        );
                }
                server.middleware.waitUntilValid(() =>
                    console.log(
                        boxen(readyNotice, {
                            borderColor: 'gray',
                            float: 'center',
                            align: 'center',
                            margin: 1,
                            padding: 1
                        })
                    )
                );
            },
            before(app) {
                addImgOptMiddleware(app, config.env);
            }
        };
        const { id, provideSecureHost } = config;
        if (id || provideSecureHost) {
            const hostConf = {};
            // backwards compatibility
            if (id) {
                const desiredDomain = id + '.' + configureHost.DEV_DOMAIN;
                console.warn(
                    debug.errorMsg(
                        chalk.yellowBright(`
The 'id' configuration option is deprecated and will be removed in upcoming
releases. It has been replaced by 'provideSecureHost' configuration which can
be configured to have the same effect as 'id'.

  To create the subdomain ${desiredDomain}, use:
    ${chalk.whiteBright(
        `provideSecureHost: { subdomain: "${id}", addUniqueHash: false }`
    )}

  To omit the default ${
      configureHost.DEV_DOMAIN
  } and specify a full alternate domain, use:
    ${chalk.whiteBright(
        `provideSecureHost: { exactDomain: "${id}.example.dev" }`
    )}
  (or any other top-level domain).

  ${helpText}`)
                    )
                );

                hostConf.addUniqueHash = false;
                hostConf.subdomain = id;
            } else if (provideSecureHost === true) {
                hostConf.addUniqueHash = true;
            } else if (typeof provideSecureHost === 'object') {
                Object.assign(hostConf, provideSecureHost);
            } else {
                throw new Error(
                    debug.errorMsg(
                        `Unrecognized argument to 'provideSecureHost'. Must be a boolean or an object with 'addUniqueHash', 'subdomain', and/or 'domain' properties.`
                    )
                );
            }
            const { hostname, ports, ssl } = await configureHost(hostConf);

            devServerConfig.host = hostname;
            devServerConfig.https = ssl;

            const requestedPort =
                process.env.PWA_STUDIO_PORTS_DEVELOPMENT || ports.development;
            if (
                (await portscanner.checkPortStatus(requestedPort)) === 'closed'
            ) {
                devServerConfig.port = requestedPort;
            } else {
                console.warn(
                    chalk.yellowBright(
                        '\n' +
                            debug.errorMsg(
                                `This project's dev server is configured to run at ${hostname}:${requestedPort}, but port ${requestedPort} is in use. The dev server will run temporarily on port ${chalk.underline.whiteBright(
                                    devServerConfig.port
                                )}; you may see inconsistent ServiceWorker behavior.`
                            ) +
                            '\n'
                    )
                );
            }
        } else {
            console.warn(secureHostWarning + helpText);
        }

        if (config.graphqlPlayground) {
            const endpoint = '/graphql';

            const oldBefore = devServerConfig.before;
            devServerConfig.before = (app, server) => {
                oldBefore(app, server);
                let middleware;
                const gatheringQueryTabs = new Promise((resolve, reject) => {
                    const { compiler } = server.middleware.context;
                    compiler.hooks.done.tap('PWADevServer', async stats => {
                        const queryFilePaths = [];
                        for (const filename of stats.compilation
                            .fileDependencies) {
                            if (filename.endsWith('.graphql')) {
                                queryFilePaths.push(filename);
                            }
                        }
                        try {
                            resolve(
                                await Promise.all(
                                    queryFilePaths.map(async queryFile => {
                                        const query = await readFile(
                                            queryFile,
                                            'utf8'
                                        );
                                        const name = relative(
                                            process.cwd(),
                                            queryFile
                                        );
                                        return {
                                            endpoint,
                                            name,
                                            query
                                        };
                                    })
                                )
                            );
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                const noop = () => {};
                app.get('/graphiql', async (req, res) => {
                    if (!middleware) {
                        middleware = playgroundMiddleware({
                            endpoint,
                            tabs: await gatheringQueryTabs
                        });
                    }
                    // this middleware has a bad habit of calling next() when it
                    // should not, so let's give it a noop next()
                    middleware(req, res, noop);
                });
            };
        }

        // Public path must be an absolute URL to enable hot module replacement
        // If public key is set, then publicPath should equal the public key value - supports proxying https://bit.ly/2EOBVYL
        devServerConfig.publicPath = devServerConfig.public
            ? `https://${devServerConfig.public}/`
            : url.format({
                  protocol: devServerConfig.https ? 'https:' : 'http:',
                  hostname: devServerConfig.host,
                  port: devServerConfig.port,
                  // ensure trailing slash
                  pathname: config.publicPath.replace(/([^\/])$/, '$1/')
              });
        return devServerConfig;
    }
};
module.exports = PWADevServer;
