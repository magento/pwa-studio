require('dotenv').config();
const debug = require('../util/debug').makeFileLogger(__filename);
const debugErrorMiddleware = require('debug-error-middleware').express;
const {
    default: playgroundMiddleware
} = require('graphql-playground-middleware-express');
const url = require('url');
const chalk = require('chalk');
const configureHost = require('../Utilities/configureHost');
const portscanner = require('portscanner');
const { readFile: readFileAsync } = require('fs');
const { promisify } = require('util');
const readFile = promisify(readFileAsync);
const path = require('path');
const boxen = require('boxen');
const webpack = require('webpack');
const UpwardDevServerPlugin = require('./plugins/UpwardDevServerPlugin');
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
    async configure(devServerConfig, webpackConfig) {
        debug('configure() invoked', devServerConfig);
        const {
            devServer = {},
            customOrigin = {},
            imageService = {},
            backendUrl,
            graphqlPlayground,
            upwardPath = 'upward.yml'
        } = devServerConfig;

        const {
            context,
            output: { publicPath }
        } = webpackConfig;

        const webpackDevServerOptions = {
            contentBase: false, // UpwardDevServerPlugin serves static files
            compress: true,
            hot: true,
            writeToDisk: true,
            watchOptions: {
                // polling is CPU intensive - provide the option to turn it on if needed
                poll: !!parseInt(devServer.watchOptionsUsePolling) || false
            },
            host: '0.0.0.0',
            port:
                devServer.port || (await portscanner.findAPortNotInUse(10000)),
            stats: 'normal',
            after(app, server) {
                app.use(debugErrorMiddleware());
                let readyNotice = chalk.green(
                    `PWADevServer ready at ${chalk.greenBright.underline(
                        webpackDevServerOptions.publicPath
                    )}`
                );
                if (graphqlPlayground) {
                    readyNotice +=
                        '\n' +
                        chalk.blueBright(
                            `GraphQL Playground ready at ${chalk.blueBright.underline(
                                new url.URL(
                                    '/graphiql',
                                    webpackDevServerOptions.publicPath
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
                addImgOptMiddleware(app, {
                    ...imageService,
                    backendUrl
                });
            }
        };
        if (customOrigin.enabled) {
            if (devServer.host) {
                const { host } = devServer;
                console.warn(
                    `Custom origins are enabled for this project, but the environment is overriding the custom hostname with ${
                        devServer.host
                    }`
                );
                webpackDevServerOptions.host = host;
            } else {
                const customOriginConfig = await configureHost(
                    Object.assign(customOrigin, {
                        dir: context,
                        interactive: false
                    })
                );
                if (!customOriginConfig) {
                    console.warn(
                        chalk.yellowBright(
                            'Custom origins are enabled for this project, but one has not yet been set up. Run `npx @magento/pwa-buildpack init-custom-origin <projectRoot>` to initialize a custom origin.'
                        )
                    );
                } else {
                    const { hostname, ssl, ports } = customOriginConfig;
                    webpackDevServerOptions.host = hostname;
                    webpackDevServerOptions.https = ssl;

                    const requestedPort = devServer.port || ports.development;
                    if (
                        (await portscanner.checkPortStatus(requestedPort)) ===
                        'closed'
                    ) {
                        webpackDevServerOptions.port = requestedPort;
                    } else {
                        console.warn(
                            chalk.yellowBright(
                                '\n' +
                                    debug.errorMsg(
                                        `This project's dev server is configured to run at ${hostname}:${requestedPort}, but port ${requestedPort} is in use. The dev server will run temporarily on port ${chalk.underline.whiteBright(
                                            webpackDevServerOptions.port
                                        )}; you may see inconsistent ServiceWorker behavior.`
                                    ) +
                                    '\n'
                            )
                        );
                    }
                }
            }
        } else {
            console.warn(secureHostWarning + helpText);
        }

        if (graphqlPlayground) {
            const endpoint = '/graphql';

            const oldBefore = webpackDevServerOptions.before;
            webpackDevServerOptions.before = (app, server) => {
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
                                        const name = path.relative(
                                            context,
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
                /* istanbul ignore next: dummy next() function not testable */
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
        webpackDevServerOptions.publicPath = devServer.public
            ? `https://${devServer.public}/`
            : url.format({
                  protocol: webpackDevServerOptions.https ? 'https:' : 'http:',
                  hostname: webpackDevServerOptions.host,
                  port: webpackDevServerOptions.port,
                  // ensure trailing slash
                  pathname: publicPath.replace(/([^\/])$/, '$1/')
              });

        // now decorate the webpack config object itself!
        webpackConfig.devServer = webpackDevServerOptions;

        // A DevServer generates its own unique output path at startup. It needs
        // to assign the main outputPath to this value as well.
        webpackConfig.output.publicPath = webpackDevServerOptions.publicPath;

        const plugins = webpackConfig.plugins || (webpackConfig.plugins = []);
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new UpwardDevServerPlugin(
                webpackDevServerOptions,
                process.env,
                path.resolve(webpackConfig.output.path, upwardPath)
            )
        );

        return webpackDevServerOptions;
    }
};
module.exports = PWADevServer;
