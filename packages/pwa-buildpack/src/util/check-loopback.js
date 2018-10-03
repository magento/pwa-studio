const debug = require('./debug').makeFileLogger(__filename);
const { lookup } = require('./promisified/dns');

async function resolveIp(hostname) {
    debug(`checking if ${hostname} is loopback`);
    try {
        const lookedUp = await lookup(hostname);
        return lookedUp;
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
}

async function checkLoopback(hostnames) {
    if (
        !Array.isArray(hostnames) ||
        hostnames.some(name => typeof name !== 'string')
    ) {
        throw new Error(
            debug.errorMsg(`hostnames must be an array of strings`)
        );
    }
    const ips = await Promise.all(hostnames.map(resolveIp));

    return new Set(
        hostnames.filter((hostname, i) => {
            const ip = ips[i];
            const loopsBack =
                ip && (ip.address === '127.0.0.1' || ip.address === '::1');

            if (loopsBack) {
                debug(`${hostname} already resolves to ${ip.address}!`);
            }

            return loopsBack;
        })
    );
}

module.exports = checkLoopback;
