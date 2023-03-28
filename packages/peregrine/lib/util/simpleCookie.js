export default class Cookie {
    constructor() {}
    static get(key) {
        const row = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${key}=`));

        return row ? row.split('=')[1] : undefined;
    }
    static set(name, value) {
        document.cookie = `${name}=${value};`;
    }
}
