const debug = require('debug')('upward-js:ProxyResolver');
const proxyMiddleware = require('http-proxy-middleware');
const AbstractResolver = require('./AbstractResolver');

const AllServers = new Map();
class ProxyResolver extends AbstractResolver {
    static get resolverType() {
        return 'proxy';
    }
    static get telltale() {
        return 'target';
    }
    static get servers() {
        return AllServers;
    }
    async resolve(definition) {
        if (!definition.target) {
            throw new Error(
                `'target' URL argument is required: ${JSON.stringify(
                    definition
                )}`
            );
        }
        const toResolve = [
            this.visitor.upward(definition, 'target'),
            definition.ignoreSSLErrors
                ? this.visitor.upward(definition, 'ignoreSSLErrors')
                : false
        ];
        const [targetUrl, ignoreSSLErrors] = await Promise.all(toResolve);

        debug('resolved target %o', targetUrl);
        if (typeof targetUrl !== 'string' && !targetUrl.href) {
            throw new Error(
                `'target' argument to ProxyResolver must be a string or URL object, but was a: ${typeof targetUrl}`
            );
        }

        let server = ProxyResolver.servers.get(targetUrl);
        if (!server) {
            debug(`creating new server for ${targetUrl}`);
            server = proxyMiddleware({
                target: targetUrl.toString(),
                secure: !ignoreSSLErrors,
                changeOrigin: true,
                autoRewrite: true,
                cookieDomainRewrite: ''
            });
            ProxyResolver.servers.set(targetUrl, server);
        }

        return server;
    }
}

module.exports = ProxyResolver;
