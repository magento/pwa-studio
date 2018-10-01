const debug = require('../util/debug').makeFileLogger(__filename);
const { join } = require('path');
const { createHash } = require('crypto');
const url = require('url');
const express = require('express');
const GlobalConfig = require('../util/global-config');
const SSLCertStore = require('../util/ssl-cert-store');
const optionsValidator = require('../util/options-validator');
const middlewares = {
    originSubstitution: require('./middlewares/OriginSubstitution'),
    devProxy: require('./middlewares/DevProxy'),
    staticRootRoute: require('./middlewares/StaticRootRoute')
};
const { lookup } = require('../util/promisified/dns');
const { find: findPort } = require('../util/promisified/openport');
const runAsRoot = require('../util/run-as-root');
const PWADevServer = {
    DEFAULT_NAME: 'my-pwa',
    DEV_DOMAIN: 'local.pwadev',
    validateConfig: optionsValidator('PWADevServer', {
        publicPath: 'string',
        backendDomain: 'string',
        'paths.output': 'string',
        serviceWorkerFileName: 'string'
    }),
    portsByHostname: new GlobalConfig({
        prefix: 'devport-byhostname',
        key: x => x
    }),
    async setLoopback(hostname) {
        debug(`checking if ${hostname} is loopback`);
        let ip;
        try {
            ip = await lookup(hostname);
        } catch (e) {
            if (e.code !== 'ENOTFOUND') {
                throw Error(
                    debug.errorMsg(
                        `Error trying to check that ${hostname} is loopback: ${
                            e.message
                        }`
                    )
                );
            }
        }
        if (ip && (ip.address === '127.0.0.1' || ip.address === '::1')) {
            debug(`${hostname} already resolves to ${ip.address}!`);
        } else {
            debug(
                `setting ${hostname} loopback in /etc/hosts, may require password...`
            );
            return runAsRoot(
                `Resolving ${hostname} to localhost and editing the hostfile requires temporary administrative privileges.\n Enter password for %u on %H: `,
                /* istanbul ignore next: never runs in process */
                d => require('hostile').set('127.0.0.1', d),
                hostname
            );
        }
    },
    async findFreePort() {
        const reserved = await PWADevServer.portsByHostname.values(Number);
        debug(`findFreePort(): these ports already reserved`, reserved);
        return findPort({
            startingPort: 8000,
            endingPort: 9999,
            avoid: reserved
        }).catch(e => {
            throw Error(
                debug.errorMsg(
                    `Unable to find an open port. You may want to delete your database file at ${GlobalConfig.getDbFilePath()} to clear out old developer hostname entries. (Soon we will make this easier and more automatic.) Original error: ${e.toString()}`
                )
            );
        });
    },
    getUniqueSubdomain(customName) {
        let name = PWADevServer.DEFAULT_NAME;
        if (typeof customName === 'string') {
            name = customName;
        } else {
            const pkgLoc = join(process.cwd(), 'package.json');
            try {
                // eslint-disable-next-line node/no-missing-require
                const pkg = require(pkgLoc);
                if (!pkg.name || typeof pkg.name !== 'string') {
                    throw new Error(
                        `package.json does not have a usable "name" field!`
                    );
                }
                name = pkg.name;
            } catch (e) {
                console.warn(
                    debug.errorMsg(
                        `getUniqueSubdomain(): Using default "${name}" prefix. Could not autodetect theme name from package.json: `
                    ),
                    e
                );
            }
        }
        const dirHash = createHash('md4');
        // Using a hash of the current directory is a natural way of preserving
        // the same "unique" ID for each project, and changing it only when its
        // location on disk has changed.
        dirHash.update(process.cwd());
        const digest = dirHash.digest('base64');
        // Base64 truncated to 5 characters, stripped of special characters,
        // and lowercased to be a valid domain, is about 36^5 unique values.
        // There is therefore a chance of a duplicate ID and host collision,
        // specifically a 1 in 60466176 chance.
        return `${name}-${digest.slice(0, 5)}`
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/^-+/, '');
    },
    async provideUniqueHost(prefix) {
        debug(`provideUniqueHost ${prefix}`);
        return PWADevServer.provideCustomHost(
            PWADevServer.getUniqueSubdomain(prefix)
        );
    },
    async provideCustomHost(subdomain) {
        debug(`provideUniqueHost ${subdomain}`);
        const hostname = subdomain + '.' + PWADevServer.DEV_DOMAIN;

        const [usualPort, freePort] = await Promise.all([
            PWADevServer.portsByHostname.get(hostname),
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

        PWADevServer.setLoopback(hostname);

        return {
            protocol: 'https:',
            hostname,
            port
        };
    },
    async configure(config) {
        debug('configure() invoked', config);
        PWADevServer.validateConfig('.configure(config)', config);
        const devServerConfig = {
            contentBase: false,
            compress: true,
            hot: true,
            host: 'localhost',
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
            before(app) {
                if (config.changeOrigin) {
                    // replace origins in links in returned html
                    app.use(
                        middlewares.originSubstitution(
                            new url.URL(config.backendDomain),
                            {
                                hostname: devServerConfig.host,
                                port: devServerConfig.port
                            }
                        )
                    );
                }
                // serviceworker root route
                app.use(
                    middlewares.staticRootRoute(
                        join(config.paths.output, config.serviceWorkerFileName)
                    )
                );
            },
            after(app) {
                // set static server to load and serve from different paths
                app.use(config.publicPath, express.static(config.paths.output));

                // proxy to backend
                app.use(
                    middlewares.devProxy({
                        target: config.backendDomain
                    })
                );
            }
        };
        let devHost;
        if (config.id) {
            devHost = await PWADevServer.provideCustomHost(config.id);
        } else if (config.provideUniqueHost) {
            devHost = await PWADevServer.provideUniqueHost(
                config.provideUniqueHost
            );
        }
        if (devHost) {
            devServerConfig.host = devHost.hostname;
            devServerConfig.port = devHost.port;
        } else {
            devServerConfig.port = await PWADevServer.findFreePort();
        }
        if (config.provideSSLCert) {
            devServerConfig.https = await SSLCertStore.provide(
                devServerConfig.host
            );
        }
        devServerConfig.publicPath = url.format({
            protocol: config.provideSSLCert ? 'https:' : 'http:',
            hostname: devServerConfig.host,
            port: devServerConfig.port,
            pathname: config.publicPath
        });

        return devServerConfig;
    }
};
module.exports = PWADevServer;
