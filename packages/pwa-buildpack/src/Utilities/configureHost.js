const debug = require('../util/debug').makeFileLogger(__filename);
const { join } = require('path');
const { createHash } = require('crypto');
const devcert = require('devcert');
const os = require('os');
const chalk = require('chalk');
const execa = require('execa');
const isElevated = require('is-elevated');
const appConfigPath = require('application-config-path');
const { username } = os.userInfo();

// On OSX and Windows, the default app config paths contain spaces. If copying
// and pasting from console output, any spaces will need explicit escaping.
const devCertConfigPath = appConfigPath('devcert').replace(/ /g, '\\ ');

/**
 * Monkeypatch devcert to fix
 * https://github.com/magento-research/pwa-studio/issues/679 which is blocked by
 * https://github.com/davewasmer/devcert/pull/30.
 * TODO: Remove this when a release of devcert without this bug is available
 */
const devCertUtils = require('devcert/dist/utils');
const MacOSPlatform = require('devcert/dist/platforms/darwin');
/* istanbul ignore next */
const proto = (MacOSPlatform.default || MacOSPlatform).prototype;
/* istanbul ignore next */
proto.isNSSInstalled = function() {
    debug(
        'Running patched `MacOSPlatform#isNSSInstalled method to detect certutil installation'
    );
    try {
        return devCertUtils
            .run('brew list -1')
            .toString()
            .includes('\nnss\n');
    } catch (e) {
        debug('certutil not installed!');
        return false;
    }
};

const DEFAULT_NAME = 'my-pwa';
const DEV_DOMAIN = 'local.pwadev';

const willNotPasswordPrompt = async () => {
    try {
        // On Windows we will have no sudo or a non-standard sudo, so we should
        // not even try this.
        /* istanbul ignore else */
        if (process.platform !== 'win32') {
            // If standard `sudo` has run in the TTY recently, it may still have
            // a credential cached and it won't prompt for the password.
            // The -n flag means "non-interactive", so sudo will exit nonzero
            // instead of password prompting if the shell is not currently
            // authenticated.
            debug('Using sudo -n true to test whether credential is active');
            await execa.shell('sudo -n true');
            debug('sudo -n true succeeded, session is active');
            // If that succeeds, the shell is authenticated and it won't prompt:
            return true;
        }
    } catch (e) {
        debug(`sudo -n failed: ${e}\n\n trying isElevated()`);
        // Recover; the rest of this method will run if sudo -n failed.
    }
    const elevated = await isElevated();
    debug(`isElevated() === ${elevated}`);
    return elevated;
};

const alreadyProvisioned = hostname => {
    const exists = devcert.configuredDomains().includes(hostname);
    debug(`${hostname} already provisioned? ${exists}`);
    return exists;
};

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

        // Resolve with the cert info, or reject using a custom error argument.
        const tryGetCert = async (rejecter = x => x) => {
            try {
                const certBuffers = await devcert.certificateFor(hostname);
                debug(`devcert.certificateFor(${hostname}) succeeded`);
                resolve({
                    key: certBuffers.key.toString('utf8'),
                    cert: certBuffers.cert.toString('utf8')
                });
            } catch (e) {
                debug(`devcert.certificateFor(${hostname}) failed, %s`, e);
                reject(await rejecter(e));
            } finally {
                clearTimeout(timeout);
                debug(`cleared getCert timeout`);
            }
        };

        // Should be able to fetch non-interactively in either of these cases
        if (alreadyProvisioned(hostname) || (await willNotPasswordPrompt())) {
            debug(
                `either provisioned already or sudo is active, trying getCert`
            );
            return tryGetCert();
        }

        // Can only enter the password if we're in a real TTY
        if (process.stdin.isTTY) {
            console.warn(
                chalk.greenBright(`Creating a local development domain requires temporary administrative privileges.
Please enter the password for ${chalk.whiteBright(
                    username
                )} on ${chalk.whiteBright(os.hostname())}.`)
            );
            return tryGetCert(
                e =>
                    new Error(
                        `Could not authenticate to modify hostfile and create protected keyfile: ${
                            e.message
                        }`
                    )
            );
        }

        // If we get here, we have neither elevated privileges nor a TTY.
        clearTimeout(timeout);
        return reject(
            new Error(
                'Creating a local development domain requires an interactive terminal for the user to answer prompts. Run the development server (e.g. `yarn run watch:venia`) by itself in the terminal to continue.'
            )
        );
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
            debug.errorMsg(`Could not setup development domain: \n${e.message}.

    If this keeps happening, you may need to delete the configuration files at
        ${devCertConfigPath}
    and try again.`)
        );
    }
}

configureHost.getUniqueDomainAndPorts = getUniqueDomainAndPorts;
configureHost.DEFAULT_NAME = DEFAULT_NAME;
configureHost.DEV_DOMAIN = DEV_DOMAIN;

module.exports = configureHost;
