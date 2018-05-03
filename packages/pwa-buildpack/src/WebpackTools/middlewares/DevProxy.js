/**
 * Proxies all requests not served by Webpack in-memory bundling back
 * to the underlying store.
 *
 * Tries to detect a case where the target URL is misconfigured and the
 * store tries to redirect to http or https.
 */
const proxy = require('http-proxy-middleware');
const { format, URL } = require('url');

const RedirectCodes = [201, 301, 302, 307, 308];
const findRedirect = message =>
    RedirectCodes.includes(message.statusCode) && message.headers.location;

const throwOnProtocolChange = (target, redirected) => {
    const backend = new URL(target);
    const { host, protocol } = new URL(redirected);
    if (backend.host === host && backend.protocol === protocol) {
        return;
    }

    if (backend.protocol === 'https:' && protocol === 'http:') {
        throw Error(
            `pwa-buildpack: Backend domain is configured to ${target}, but redirected to unsecure HTTP. Please configure backend server to use SSL.`
        );
    }

    if (backend.protocol === 'http:' && protocol === 'https:') {
        throw Error(
            `pwa-buildpack: Backend domain is configured to ${target}, but redirected to secure HTTPS. Please change configuration to point to secure backend domain: ${format(
                Object.assign(backend, { protocol: 'https:' })
            )}.`
        );
    }

    throw Error(
        `pwa-buildpack: Backend domain redirected to unknown protocol: ${redirected}`
    );
};

module.exports = function createDevProxy(
    target,
    { passthru },
    logLevel = 'debug'
) {
    const noDot = passthru.map(x => x.replace(/^\./, ''));
    return proxy(['**', `!**/*.{${noDot.join(',')}}`], {
        onProxyRes(proxyRes) {
            const redirected = findRedirect(proxyRes);
            if (redirected) {
                throwOnProtocolChange(target, redirected);
            }
        },
        target,
        logLevel,
        secure: false,
        changeOrigin: true,
        autoRewrite: true,
        cookieDomainRewrite: '' // remove any absolute domain on cookies
    });
};
