/**
 * Proxies all requests not served by Webpack in-memory bundling back
 * to the underlying store.
 *
 * Tries to detect a case where the target URL is misconfigured and the
 * store tries to redirect to http or https.
 */
const proxyMiddleware = require('http-proxy-middleware');
const optionsValidator = require('../../util/options-validator');
const { format, URL } = require('url');

const RedirectCodes = [201, 301, 302, 307, 308];
const findRedirect = message =>
    RedirectCodes.includes(message.statusCode) && message.headers.location;

const emitErrorOnProtocolChange = (emit, target, redirected) => {
    const backend = new URL(target);
    const { host, protocol } = new URL(redirected);
    if (backend.host === host && backend.protocol === protocol) {
        return;
    }

    if (backend.protocol === 'https:' && protocol === 'http:') {
        return emit(
            new Error(
                `pwa-buildpack: Backend domain is configured to ${target}, but redirected to unsecure HTTP. Please configure backend server to use SSL.`
            )
        );
    }

    if (backend.protocol === 'http:' && protocol === 'https:') {
        return emit(
            new Error(
                `pwa-buildpack: Backend domain is configured to ${target}, but redirected to secure HTTPS. Please change configuration to point to secure backend domain: ${format(
                    Object.assign(backend, { protocol: 'https:' })
                )}.`
            )
        );
    }

    emit(
        new Error(
            `pwa-buildpack: Backend domain redirected to unknown protocol: ${redirected}`
        )
    );
};

const validateConfig = optionsValidator('DevProxyMiddleware', {
    target: 'string'
});

module.exports = function createDevProxy(config) {
    validateConfig('createDevProxy', config);
    const proxyConf = Object.assign(
        {
            logLevel: 'debug',
            logProvider: defaultProvider => config.logger || defaultProvider,
            onProxyRes(proxyRes) {
                const redirected = findRedirect(proxyRes);
                if (redirected) {
                    emitErrorOnProtocolChange(
                        nextCallback,
                        config.target,
                        redirected
                    );
                }
            },
            secure: false,
            changeOrigin: true,
            autoRewrite: true,
            headers: {
                'x-node-env': 'development'
            },
            cookieDomainRewrite: '' // remove any absolute domain on cookies
        },
        config
    );
    let nextCallback;
    const proxy = proxyMiddleware('**', proxyConf);
    // Return an outer middleware so we can access the `next` function to
    // properly pass errors along.
    return (req, res, next) => {
        nextCallback = err => {
            proxyConf.logProvider(console).error(err);
            return next(err);
        };
        return proxy(req, res, next);
    };
};
