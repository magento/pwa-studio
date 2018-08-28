const traverse = require('traverse');
const { parse: urlParse } = require('url');
const debug = require('debug')('upward-js:context');

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
    ...Array.from({ length: 600 }, (_, i) => (i + 100).toString())
]);

class Context {
    static forStartup(env) {
        return new Context({ env });
    }
    static forRequest(env, reqUrl, headers) {
        const url = urlParse(reqUrl, true);
        return new Context({
            env,
            request: {
                url,
                headers,
                headerEntries: Object.entries(headers),
                queryEntries: Object.entries(url.query)
            }
        });
    }

    constructor(initial) {
        this._tree = traverse(initial);
    }

    isset(prop) {
        return constants.has(prop) || this._data.hasOwnProperty(prop);
    }

    get(path) {
        return constants.get(prop) || dotLookup(this._data, path);
    }

    assign(prop, value) {
        if (this.isset(prop)) {
            throw new Error(
                `Attempted to reassign context property '${prop}' to '${value}'. Context properties cannot be reassigned.`
            );
        }
        this._data;
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this._data));
    }

    depend(dependent, dependencyPath) {
        const allSegments = path.split('.');
        const rootProperty = allSegments[0];
        const remainingSegments = allSegments.slice(1);
        // if () {
        //     return
        // }
    }
}

module.exports = Context;
