const debug = require('../util/debug').makeFileLogger(__filename);
const { join } = require('path');
const { createHash } = require('crypto');
const devcert = require('devcert');
const os = require('os');
const chalk = require('chalk');
const execa = require('execa');
const { username } = os.userInfo();

/**
 * Monkeypatch devcert to fix
 * https://github.com/magento-research/pwa-studio/issues/679 which is blocked by
 * https://github.com/davewasmer/devcert/pull/30.
 * TODO: Remove this when a release of devcert without this bug is available
 */
const devCertUtils = require('devcert/dist/utils');
const MacOSPlatform = require('devcert/dist/platforms/darwin');
const proto = (MacOSPlatform.default || MacOSPlatform).prototype;
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

const alreadyProvisioned = hostname =>
    devcert.configuredDomains().includes(hostname);

function getCert(hostname) {
    // Manually create a Promise here to obtain a "reject" function in closure,
    // so we can use a setTimeout to reject the promise after 30 seconds.
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
                    }
                } else {
                    clearTimeout(timeout);
                    return reject(
                        new Error(
                            'Creating a local development domain requires an interactive terminal for the user to answer prompts. Run the development server (e.g. `yarn run watch:venia`) by itself in the terminal to continue.'
                        )
                    );
                }
            }
            const certBuffers = await devcert.certificateFor(hostname);
            clearTimeout(timeout);
            resolve({
                key: certBuffers.key.toString('utf8'),
                cert: certBuffers.cert.toString('utf8')
            });
        } catch (e) {
            clearTimeout(timeout);
            reject(e);
        }
    });
}

function getUniqueDomainAndPorts(customName, addUniqueHash) {
    let name = DEFAULT_NAME;
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
                    `Using default "${name}" prefix. Could not autodetect project name from package.json: `
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

    const subdomain = addUniqueHash ? `${name}-${digest.slice(0, 5)}` : name;
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

async function configureHost({
    addUniqueHash = true,
    subdomain,
    exactDomain,
    interactive = true
} = {}) {
    const { uniqueSubdomain, ports } = getUniqueDomainAndPorts(
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
