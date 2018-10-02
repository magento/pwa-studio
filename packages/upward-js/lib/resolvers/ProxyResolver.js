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
        const [target, ignoreSSLErrors] = await Promise.all(toResolve);

        debug('resolved target %o', target);
        if (typeof target !== 'string') {
            throw new Error(
                `'target' argument to ProxyResolver must be a string URL, but was a: ${typeof target}`
            );
        }

        let server = ProxyResolver.servers.get(target);
        if (!server) {
            debug(`creating new server for ${target}`);
            server = proxyMiddleware({
                target,
                secure: !ignoreSSLErrors,
                changeOrigin: true,
                autoRewrite: true,
                cookieDomainRewrite: ''
            });
            ProxyResolver.servers.set(target, server);
        }

        return server;
    }
}

module.exports = ProxyResolver;
