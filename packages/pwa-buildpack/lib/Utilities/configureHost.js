const debug = require('../util/debug').makeFileLogger(__filename);
const { join } = require('path');
const { createHash } = require('crypto');
const devcert = require('devcert');
const os = require('os');
const chalk = require('chalk');
const execa = require('execa');
const pkgDir = require('pkg-dir');
const { username } = os.userInfo();

/**
 * Monkeypatch devcert to fix
 * https://github.com/magento/pwa-studio/issues/679 which is blocked by
 * https://github.com/davewasmer/devcert/pull/30.
 * TODO: Remove this when a release of devcert without this bug is available
 */
const devCertUtils = require('devcert/dist/utils');
const MacOSPlatform = require('devcert/dist/platforms/darwin');
/* istanbul ignore next: temporary until we switch to devcert fork */
const proto = (MacOSPlatform.default || MacOSPlatform).prototype;
/* istanbul ignore next: temporary until we switch to devcert fork */
proto.isNSSInstalled = function() {
    try {
        return devCertUtils
            .run('brew list -1')
            .toString()
            .includes('\nnss\n');
    } catch (e) {
        return false;
    }
};

const DEFAULT_NAME = 'my-pwa';
const DEV_DOMAIN = 'local.pwadev';

const isSudoSession = () =>
    execa
        .shell('sudo -n true')
        .then(() => true)
        .catch(() => false);

const alreadyProvisioned = hostname => {
    const configuredDomains = devcert.configuredDomains();
    debug(
        'checking for %s in devcert.configuredDomains() === %o',
        hostname,
        configuredDomains
    );
    const isProvisioned = configuredDomains.includes(hostname);
    debug('isProvisioned? %s', isProvisioned);
    return isProvisioned;
};

function getCert(hostname) {
    // Manually create a Promise here to obtain a "reject" function in closure,
    // so we can use a setTimeout to reject the promise after 30 seconds.
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(
            () =>
                reject(
                    new Error(
                        'Timed out waiting for SSL certificate generation and trust.'
                    )
                ),
            30000
        );
        debug('set UI timeout for getCert("%s")', hostname);
        try {
            if (!alreadyProvisioned(hostname)) {
                if (process.stdin.isTTY) {
                    if (!(await isSudoSession())) {
                        console.warn(
                            chalk.greenBright(`Creating a local development domain requires temporary administrative privileges.
Please enter the password for ${chalk.whiteBright(
                                username
                            )} on ${chalk.whiteBright(os.hostname())}.`)
                        );
                    } else {
                        debug('appears to be a sudo session already');
                    }
                } else {
                    debug(
                        'non-interactive! cleared UI timeout for getCert("%s")',
                        hostname
                    );
                    clearTimeout(timeout);
                    return reject(
                        new Error(
                            'Creating a local development domain requires an interactive terminal for the user to answer prompts. Run the development server (e.g. `yarn run watch:venia`) by itself in the terminal to continue.'
                        )
                    );
                }
            }
            const certBuffers = await devcert.certificateFor(hostname);
            debug('certBuffers arrived with %s', Object.keys(certBuffers));
            debug('success! cleared UI timeout for getCert("%s")', hostname);
            clearTimeout(timeout);
            resolve({
                key: certBuffers.key.toString('utf8'),
                cert: certBuffers.cert.toString('utf8')
            });
        } catch (e) {
            clearTimeout(timeout);
            debug(
                'failure! cleared UI timeout for getCert("%s"): %o',
                hostname,
                e
            );
            reject(e);
        }
    });
}

function getUniqueDomainAndPorts(directory, customName, addUniqueHash) {
    debug(
        'getUniqueDomainAndPorts(directory %s, customName %s, addUniqueHash %s',
        directory,
        customName,
        addUniqueHash
    );
    let name = DEFAULT_NAME;

    if (customName && typeof customName === 'string') {
        name = customName;
    } else {
        const packageDir = pkgDir.sync(directory);
        debug(
            'try getting package name from pkgDir.sync(%s), which is %s',
            directory,
            packageDir
        );
        const pkgLoc = join(packageDir, 'package.json');
        try {
            // eslint-disable-next-line node/no-missing-require
            const pkg = require(pkgLoc);
            debug('retrieved %s: %O', pkgLoc, pkg);
            if (!pkg.name || typeof pkg.name !== 'string') {
                throw new Error(
                    `package.json does not have a usable "name" field!`
                );
            }
            name = pkg.name;
            debug('retrieved project name %s from %s', name, pkgLoc);
        } catch (e) {
            console.warn(
                debug.errorMsg(
                    `Using default "${name}" prefix. Could not autodetect project name from package.json: `
                )
            );
            debug('pkgDir failed %s', e);
        }
    }
    const dirHash = createHash('md4');
    // Using a hash of the current directory is a natural way of preserving
    // the same "unique" ID for each project, and changing it only when its
    // location on disk has changed.
    dirHash.update(directory);
    const digest = dirHash.digest('base64');
    debug('digest created %s', digest);

    const subdomain = addUniqueHash ? `${name}-${digest.slice(0, 5)}` : name;
    debug('subdomain created %s', subdomain);
    // Base64 truncated to 5 characters, stripped of special characters,
    // and lowercased to be a valid domain, is about 36^5 unique values.
    // There is therefore a chance of a duplicate ID and host collision,
    // specifically a 1 in 60466176 chance.

    // Use the same current directory hash to create a "unique" port number.
    // This creates a number from 1 to 1000 that wil stay constant for the
    // current directory. We'll create dev and staging ports for it.
    const uniquePortOffset =
        parseInt(
            Buffer.from(digest, 'base64')
                .toString('hex')
                .slice(-5),
            16
        ) % 1000;

    const ports = {
        development: 8000 + uniquePortOffset,
        staging: 9000 + uniquePortOffset
    };
    debug('ports created %o', ports);
    // In contrast, port collisions are more likely (1 in 1000), It could be a
    // lower probability if we allowed more possible ports, but for convenience
    // and developer recognition, we limit ports to the 8xxx range for
    // development and 9xxx range for staging. Fortunately, unlike domains,
    // ports are easy to rebind at runtime if a collision occurs.

    return {
        uniqueSubdomain: subdomain
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/^-+/, ''),
        ports
    };
}

async function configureHost(options) {
    debug('options %o', options);
    const {
        addUniqueHash = true,
        dir,
        subdomain,
        exactDomain,
        interactive = true
    } = options;
    const { uniqueSubdomain, ports } = getUniqueDomainAndPorts(
        dir,
        exactDomain || subdomain,
        addUniqueHash
    );
    let hostname;
    if (exactDomain) {
        hostname = exactDomain;
    } else {
        hostname = uniqueSubdomain + '.' + DEV_DOMAIN;
    }
    if (!alreadyProvisioned(hostname) && interactive === false) {
        return false;
    }
    try {
        return {
            hostname,
            ports,
            ssl: await getCert(hostname)
        };
    } catch (e) {
        throw Error(
            debug.errorMsg(`Could not setup development domain: \n${e.stack}`)
        );
    }
}

configureHost.getUniqueDomainAndPorts = getUniqueDomainAndPorts;
configureHost.DEFAULT_NAME = DEFAULT_NAME;
configureHost.DEV_DOMAIN = DEV_DOMAIN;

module.exports = configureHost;
