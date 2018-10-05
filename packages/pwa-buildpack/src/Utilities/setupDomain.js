const debug = require('../util/debug').makeFileLogger(__filename);
const GlobalConfig = require('../util/global-config');
const { exec } = require('../util/promisified/child_process');
const { join } = require('path');
const { createHash } = require('crypto');
const checkLoopback = require('../util/check-loopback');
const runAsRoot = require('../util/run-as-root');

const DEFAULT_NAME = 'my-pwa';
const DEV_DOMAIN = 'local.pwadev';

const userCerts = new GlobalConfig({
    prefix: 'devcert',
    key: x => x
});

function certIsExpired(cert) {
    return exec(`openssl x509 -checkend 0 <<< "${cert}"`)
        .then(() => false)
        .catch(({ stdout }) => stdout.trim() === 'Certificate will expire');
}

async function getCert(commonName) {
    let certPair = await userCerts.get(commonName);
    if (certPair && (await certIsExpired(certPair.cert))) {
        certPair = null;
        await userCerts.del(commonName);
    }
    return certPair || null;
}

function getUniqueSubdomain(customName) {
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
                    `getUniqueSubdomain(): Using default "${name}" prefix. Could not autodetect project name from package.json: `
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
}

/* istanbul ignore next: runs in sub-process */
const sudoTask = async (setLoopbacks, makeCerts) => {
    if (setLoopbacks.length > 0) {
        var hostile = require('hostile');
        setLoopbacks.forEach(name => hostile.set('127.0.0.1', name));
    }
    if (makeCerts.length > 0) {
        const devcert = require('@magento/devcert');
        const certs = Promise.all(makeCerts.map(name => devcert(name)));
        process.stdout.write(JSON.stringify(certs));
    }
};

const defaultOpts = {
    secure: true,
    unique: true,
    dryRun: false
};
async function setupDomain(customName, opts) {
    const { secure, unique, dryRun } = Object.assign({}, defaultOpts, opts);
    const setLoopbacks = [];
    const makeCerts = [];
    const subdomain = unique ? getUniqueSubdomain(customName) : customName;
    const hostname = subdomain + '.' + DEV_DOMAIN;
    const loopbacks = await checkLoopback([hostname]);
    if (!loopbacks.has(hostname)) {
        setLoopbacks.push(hostname);
    }
    let certPair;
    if (secure) {
        certPair = await getCert(hostname);
        if (!certPair) {
            makeCerts.push(hostname);
        }
    }

    const ready = setLoopbacks.length === 0 && makeCerts.length === 0;
    if (dryRun) {
        return {
            setLoopbacks,
            makeCerts,
            ready
        };
    }
    if (!ready) {
        try {
            const output = await runAsRoot(
                'Creating a local development domain requires temporary administrative privileges.\n Enter password for %u on %H: ',
                sudoTask,
                setLoopbacks,
                makeCerts
            );
            if (secure && !certPair) {
                certPair = JSON.parse(output)[0];
                await userCerts.set(hostname, certPair);
            }
        } catch (e) {
            throw Error(
                debug.errorMsg(
                    `Error setting up development domain: ${e.message} ${
                        e.stack
                    }`
                )
            );
        }
    }
    return {
        hostname,
        certPair
    };
}

setupDomain.userCerts = userCerts;
setupDomain.getUniqueSubdomain = getUniqueSubdomain;
setupDomain.DEFAULT_NAME = DEFAULT_NAME;
setupDomain.DEV_DOMAIN = DEV_DOMAIN;

module.exports = setupDomain;
