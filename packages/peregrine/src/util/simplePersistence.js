/**
 * Persistence layer with expiration based on localStorage.
 */

class NamespacedLocalStorage {
    constructor(localStorage, key) {
        this.localStorage = localStorage;
        this.key = key;
    }
    _makeKey(key) {
        return `${this.key}__${key}`;
    }
    getItem(name) {
        return this.localStorage.getItem(this._makeKey(name));
    }
    setItem(name, value) {
        return this.localStorage.setItem(this._makeKey(name), value);
    }
    removeItem(name) {
        return this.localStorage.removeItem(this._makeKey(name));
    }
}

export default class BrowserPersistence {
    static KEY = 'M2_VENIA_BROWSER_PERSISTENCE';
    constructor() {
        this.storage = new NamespacedLocalStorage(
            window.localStorage,
            this.constructor.KEY || BrowserPersistence.KEY
        );
    }
    getItem(name) {
        const now = Date.now();
        const item = this.storage.getItem(name);
        if (!item) {
            return undefined;
        }
        const { value, ttl, timeStored } = JSON.parse(item);
        if (ttl && now - timeStored > ttl * 1000) {
            this.storage.removeItem(name);
            return undefined;
        }
        return JSON.parse(value);
    }
    setItem(name, value, ttl) {
        const timeStored = Date.now();
        this.storage.setItem(
            name,
            JSON.stringify({
                value: JSON.stringify(value),
                timeStored,
                ttl
            })
        );
    }
    removeItem(name) {
        this.storage.removeItem(name);
    }
}
