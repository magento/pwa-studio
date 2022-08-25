const debug = require('debug')('upward-js:ProxyResolver');
const proxyMiddleware = require('http-proxy-middleware');
const AbstractResolver = require('./AbstractResolver');
const { Agent: HTTPSAgent, globalAgent } = require('https');

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
            const target = new URL(targetUrl);
            debug(`creating new server for ${targetUrl}`);

            let agent;
            if (target.protocol === 'https:') {
                agent = globalAgent;
                if (ignoreSSLErrors) {
                    debug(
                        `target "%s" uses HTTPS and ignoreSSLErrors=true, creating HTTPSAgent({ rejectUnauthorized: false })`
                    );
                    agent = new HTTPSAgent({ rejectUnauthorized: false });
                } else {
                    debug(`target "%s" uses HTTPS, using global https agent`);
                    agent = globalAgent;
                }
            } else {
                debug(`target "%s" uses unsecure http`);
                agent = null;
            }
            const opts = {
                agent,
                target: target.href,
                changeOrigin: true,
                autoRewrite: true,
                cookieDomainRewrite: '',
                xfwd: true
            };
            if (target.username) {
                debug(`target URL contains a username, adding auth to proxy`);
                opts.auth = [target.username, target.password].join(':');
            }
            server = proxyMiddleware(opts);
            ProxyResolver.servers.set(target.href, server);
        }

        return server;
    }
}

module.exports = ProxyResolver;
