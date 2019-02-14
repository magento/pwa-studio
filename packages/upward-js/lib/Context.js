const debug = require('debug')('upward-js:Context');
const { pick } = require('lodash');
const { URL } = require('url');

const ContextPath = require('./ContextPath');

const statusCodes = Array.from({ length: 600 }, (_, i) => i + 100);
const constants = new Set([
    true,
    false,
    'GET',
    'POST',
    'mustache',
    'text/html',
    'text/plain',
    'application/json',
    'utf-8',
    'utf8',
    'latin-1',
    'base64',
    'binary',
    'hex',
    ...statusCodes,
    ...statusCodes.map(code => code.toString())
]);

class Context {
    static fromRequest(env, request) {
        debug('generating from request: %s', request.url);
        const hostedUrl = new URL(request.url, `http://${request.get('host')}`);
        debug('url derived from host is %O', hostedUrl);
        const url = pick(hostedUrl, [
            'host',
            'hostname',
            'port',
            'pathname',
            'path',
            'search',
            'searchParams'
        ]);
        url.query = request.query;
        return new Context({
            env,
            request: {
                url,
                headers: request.headers,
                headerEntries: Object.entries(request.headers).map(
                    ([name, value]) => ({ name, value })
                ),
                queryEntries: Object.entries(url.query).map(
                    ([name, value]) => ({ name, value })
                )
            }
        });
    }

    constructor(data) {
        this._data = data;
        this._promises = new Map();
    }

    setVisitor(visitor) {
        this.visitor = visitor;
    }

    async get(lookup) {
        if (constants.has(lookup) || constants.has(lookup.toString())) {
            debug('%s is a constant', lookup);
            return lookup;
        }
        const path = ContextPath.from(lookup);
        debug('lookup %s at path %s', lookup, path);
        const base = path.base();
        debug('%s is from context base %s', lookup, base);
        if (!this._data.hasOwnProperty(base)) {
            debug('%s not yet assigned, acquiring promise handle', base);
            let promise = this._promises.get(base);
            if (!promise) {
                debug('%s has never been requested, visiting from root', base);
                promise = this.visitor.downward([base]).then(value => {
                    if (typeof value === 'function') {
                        debug(
                            '%s assigned to context as function: %o',
                            base,
                            value
                        );
                        this.set(base, value);
                    } else {
                        debug('%s assigned: %o', base, value[base]);
                        this.set(base, value[base]);
                    }
                });
                this._promises.set(base, promise);
            }
            await promise;
        }
        return path.getFrom(this._data);
    }

    set(base, value, override) {
        const isSet = constants.has(base) || this._data.hasOwnProperty(base);
        if (isSet && !override) {
            throw new Error(
                `Attempted to reassign context property '${base}' to '${value}'. Context properties cannot be reassigned.`
            );
        }
        this._data[base] = value;
    }

    forget(base) {
        delete this._data[base];
    }
}

module.exports = Context;
