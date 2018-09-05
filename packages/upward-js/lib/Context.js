const debug = require('debug')('upward-js:Context');
const { parse: urlParse } = require('url');

const ContextPath = require('./ContextPath');

const statusCodes = Array.from({ length: 600 }, (_, i) => i + 100);
const constants = new Set([
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
    'hex',
    ...statusCodes,
    ...statusCodes.map(code => code.toString())
]);

class Context {
    static fromRequest(env, request) {
        debug('generating from request: %O', request);
        const url = urlParse(request.url, true);
        return new Context({
            env,
            request: {
                url,
                headers: request.headers,
                headerEntries: Object.entries(request.headers),
                queryEntries: Object.entries(url.query)
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
        debug('lookup %s', lookup);
        const path = ContextPath.from(lookup);
        if (constants.has(path.toString())) {
            debug('%s is a constant', lookup);
            return lookup;
        }
        const base = path.base();
        debug('%s is from context base %s', lookup, base);
        if (!this._data.hasOwnProperty(base)) {
            debug('%s not yet assigned, acquiring promise handle', base);
            let promise = this._promises.get(base);
            if (!promise) {
                debug('%s has never been requested, visiting from root', base);
                promise = this.visitor
                    .downward(base)
                    .then(value => this.set(base, value));
                this._promises.set(base, promise);
            }
            await promise;
        }
        return path.getFrom(this._data);
    }

    set(base, value) {
        const isSet = constants.has(base) || this._data.hasOwnProperty(base);
        if (isSet) {
            throw new Error(
                `Attempted to reassign context property '${base}' to '${value}'. Context properties cannot be reassigned.`
            );
        }
        this._data[base] = value;
    }
}

module.exports = Context;
