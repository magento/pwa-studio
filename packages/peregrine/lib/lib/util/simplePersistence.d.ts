export default class BrowserPersistence {
    static KEY: string;
    constructor(localStorage?: Storage);
    storage: NamespacedLocalStorage;
    getItem(name: any): any;
    setItem(name: any, value: any, ttl: any): void;
    removeItem(name: any): void;
}
/**
 * Persistence layer with expiration based on localStorage.
 */
declare class NamespacedLocalStorage {
    constructor(localStorage: any, key: any);
    localStorage: any;
    key: any;
    _makeKey(key: any): string;
    getItem(name: any): any;
    setItem(name: any, value: any): any;
    removeItem(name: any): any;
}
export {};
