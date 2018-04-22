const debug = require('./debug').makeFileLogger(__filename);
const { resolve } = require('path');
const { homedir } = require('os');
const { createHash } = require('crypto');
const flatfile = require('flat-file-db');

const toString = x => x.toString();

class GlobalConfig {
    static getDbFilePath() {
        return resolve(homedir(), './.config/pwa-buildpack.db');
    }
    static async db() {
        if (!this._dbPromise) {
            this._dbPromise = new Promise((resolve, reject) => {
                try {
                    const dbFilePath = this.getDbFilePath();
                    debug(`no cached db exists, pulling db from ${dbFilePath}`);
                    const db = flatfile(dbFilePath);
                    debug(`db created, waiting for open event`, db);
                    db.on('error', reject);
                    db.on('open', () => {
                        debug('db open, fulfilling to subscribers');
                        resolve(db);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
        return this._dbPromise;
    }
    constructor(options) {
        // validation
        if (typeof options !== 'object') {
            throw Error(debug.errorMsg('Must provide options.'));
        }

        const { key = toString, prefix } = options;

        if (typeof key !== 'function') {
            throw Error(
                debug.errorMsg('`key` function in options must be a function.')
            );
        }

        if (key.length === 0) {
            throw Error(
                debug.errorMsg(
                    'Provided `key` function must take at least on argument.'
                )
            );
        }

        if (typeof prefix !== 'string') {
            throw Error(
                debug.errorMsg('Must provide a `prefix` string in options.')
            );
        }

        this._makeKey = key;
        this._prefix = prefix;
    }
    makeKey(keyparts) {
        if (keyparts.length !== this._makeKey.length) {
            throw Error(
                `Wrong number of arguments sent to produce unique ${
                    this._prefix
                } key`
            );
        }
        const hash = createHash('md5');
        const key = this._makeKey(...keyparts);
        if (typeof key !== 'string') {
            throw Error(
                debug.errorMsg(
                    `key function ${this._makeKey.toString()} returned a non-string value: ${key}: ${typeof key}`
                )
            );
        }
        hash.update(key);
        return this._prefix + hash.digest('hex');
    }
    async get(...keyparts) {
        debug(`${this._prefix} get()`, keyparts);
        const db = await this.constructor.db();
        const key = this.makeKey(keyparts);
        debug(`${this._prefix} get()`, keyparts, `made key: ${key}`);
        return db.get(key);
    }
    async set(...args) {
        debug(`${this._prefix} set()`, ...args);
        const db = await this.constructor.db();
        const key = this.makeKey(args.slice(0, -1));
        debug(`${this._prefix} set()`, args, `made key: ${key}`);
        return new Promise((resolve, reject) =>
            db.put(
                key,
                args.slice(-1)[0],
                (error, response) => (error ? reject(error) : resolve(response))
            )
        );
    }
    async del(...keyparts) {
        const db = await this.constructor.db();
        const key = this.makeKey(keyparts);
        return new Promise((resolve, reject) =>
            db.del(
                key,
                (error, response) => (error ? reject(error) : resolve(response))
            )
        );
    }
    async values(xform = x => x) {
        const db = await this.constructor.db();
        return db.keys().reduce((out, k) => {
            if (k.startsWith(this._prefix)) {
                out.push(xform(db.get(k)));
            }
            return out;
        }, []);
    }
    async clear() {
        const db = await this.constructor.db();
        return new Promise((resolve, reject) =>
            db.clear(error => (error ? reject(error) : resolve()))
        );
    }
}
module.exports = GlobalConfig;
