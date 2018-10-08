const debug = require('../util/debug').makeFileLogger(__filename);
const debugErrorMiddleware = require('debug-error-middleware').express;
const url = require('url');
const GlobalConfig = require('../util/global-config');
const optionsValidator = require('../util/options-validator');
const setupDomain = require('../Utilities/setupDomain');
const { find: findPort } = require('../util/promisified/openport');
const PWADevServer = {
    validateConfig: optionsValidator('PWADevServer', {
        publicPath: 'string',
        backendDomain: 'string',
        'paths.output': 'string'
    }),
    portsByHostname: new GlobalConfig({
        prefix: 'devport-byhostname',
        key: x => x
    }),
    async findFreePort() {
        const reserved = await PWADevServer.portsByHostname.values(Number);
        debug(`findFreePort(): these ports already reserved`, reserved);
        return findPort({
            startingPort: 8000,
            endingPort: 8999,
            avoid:
                brandNew && (await PWADevServer.portsByHostname.values(Number))
        }).catch(e => {
            throw Error(
                debug.errorMsg(
                    `Unable to find an open port. You may want to delete your database file at ${GlobalConfig.getDbFilePath()} to clear out old developer hostname entries. (Soon we will make this easier and more automatic.) Original error: ${e.toString()}`
                )
            );
        });
    },
    async getPersistentDevPort(hostname) {
        // const usualPort = await PWADevServer.portsByHostname.get(hostname);

        // const freePort =

        const [usualPort, freePort] = await Promise.all([
            ,
            PWADevServer.findFreePort()
        ]);
        const port = usualPort === freePort ? usualPort : freePort;

        if (!usualPort) {
            PWADevServer.portsByHostname.set(hostname, port);
        } else if (usualPort !== freePort) {
            console.warn(
                debug.errorMsg(
                    `This project's dev server normally runs at ${hostname}:${usualPort}, but port ${usualPort} is in use. The dev server will instead run at ${hostname}:${port}, which may cause a blank or unexpected cache and ServiceWorker. Consider fully clearing your browser cache.`
                )
            );
        }

        return port;
    },
    async configure(config) {
        debug('configure() invoked', config);
        PWADevServer.validateConfig('.configure(config)', config);
        const devServerConfig = {
            contentBase: false,
            compress: true,
            hot: true,
            host: '0.0.0.0',
            stats: {
                all: false,
                builtAt: true,
                colors: true,
                errors: true,
                errorDetails: true,
                moduleTrace: true,
                timings: true,
                version: true,
                warnings: true
            },
            after(app) {
                app.use(debugErrorMiddleware());
            }
        };
        const { id, provideUniqueHost, provideSSLCert } = config;
        let uniqueName;
        if (id || provideUniqueHost) {
            const domainCustomName =
                id ||
                (typeof provideUniqueHost === 'string'
                    ? provideUniqueHost
                    : null);
            const domainSetupConfig = {
                secure: provideSSLCert,
                unique: !id
            };
            const { hostname, certPair } = await setupDomain(
                domainCustomName,
                domainSetupConfig
            );
            uniqueName = devServerConfig.host = hostname;
            devServerConfig.https = certPair;
            // workaround for https://github.com/webpack/webpack-dev-server/issues/1491
            if (devServerConfig.https) {
                devServerConfig.https.spdy = {
                    protocols: ['http/1.1']
                };
            }
        } else {
            uniqueName = setupDomain.getUniqueSubdomain();
        }

        devServerConfig.port = await PWADevServer.getPersistentDevPort(
            uniqueName
        );

        devServerConfig.publicPath = url.format({
            protocol: provideSSLCert ? 'https:' : 'http:',
            hostname: devServerConfig.host,
            port: devServerConfig.port,
            pathname: config.publicPath
        });

        return devServerConfig;
    }
};
module.exports = PWADevServer;
