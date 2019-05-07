const debug = require('debug')('upward-js:UrlResolver');
const { inspect } = require('util');
const { URL, URLSearchParams } = require('url');
const { forOwn, fromPairs, isPlainObject } = require('lodash');
const AbstractResolver = require('./AbstractResolver');

// The WHATWG URL object can't deal with relative URLs. When baseURL is false,
// generate a nonce random domain so that we can use the URL object to format.
// We'll remove it at the end to yield a relative URL back.
const randomString = Math.random()
    .toString(36)
    .slice(2, 7);
const FAKE_BASE_URL = new URL(`https://upward-fake-${randomString}.localhost`);
const NON_RELATIVE_PARTS = ['protocol', 'port', 'username', 'password'];
class UrlResolver extends AbstractResolver {
    static get resolverType() {
        return 'url';
    }
    static get telltale() {
        return 'baseUrl';
    }
    async resolve(definition) {
        const die = msg => {
            throw new Error(
                `Invalid arguments to UrlResolver: ${inspect(definition, {
                    compact: false
                })}.\n\n${msg}`
            );
        };
        if (!definition.hasOwnProperty('baseUrl')) {
            die(
                'No baseUrl specified. If the URL must be relative or requires no baseUrl, `baseUrl` must be explicitly set to false.'
            );
        }
        debug('validated config %o', definition);

        const argued = [
            'baseUrl',
            'protocol',
            'hash',
            'hostname',
            'pathname',
            'password',
            'port',
            'query',
            'search',
            'username'
        ]
            .filter(arg => definition.hasOwnProperty(arg))
            .map(async arg => [
                arg,
                await this.visitor.upward(definition, arg)
            ]);

        const { baseUrl, pathname, query, search, ...parts } = fromPairs(
            await Promise.all(argued)
        );
        const base = new URL(baseUrl && baseUrl.toString(), FAKE_BASE_URL);

        const params = new URLSearchParams(search || base.search);
        if (query) {
            if (!isPlainObject(query)) {
                die("'query' must resolve to a plain object");
            }
            forOwn(query, (value, name) => {
                params.set(name, value);
            });
        }

        const resultUrl = pathname ? new URL(pathname, base) : base;

        Object.assign(resultUrl, parts);

        const paramsString = params.toString();
        if (paramsString) {
            resultUrl.search = paramsString;
        }

        if (resultUrl.hostname === FAKE_BASE_URL.hostname) {
            // Make sure nothing is trying to set an origin property on a
            // URL meant to be relative.
            const nonRelativeArguments = NON_RELATIVE_PARTS.filter(prop =>
                parts.hasOwnProperty(prop)
            );
            if (nonRelativeArguments.length > 0) {
                die(
                    `Cannot set origin parameters "${nonRelativeArguments}" without setting hostname or baseUrl`
                );
            }
            // Make a fake root-relative URL, including leading slash.
            const relativeUrl = resultUrl.href.slice(
                FAKE_BASE_URL.href.length - 1
            );
            return {
                pathname: resultUrl.pathname,
                search: resultUrl.search,
                hash: resultUrl.hash,
                href: relativeUrl,
                toString: () => relativeUrl
            };
        }

        return resultUrl;
    }
}

module.exports = UrlResolver;
