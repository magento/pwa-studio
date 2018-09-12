const debug = require('debug')('upward-js:ContextPath');
const illegalPathChars = /(^\.+)|[^\.\w\/]/;
const contextPathCache = new Map();
class ContextPath {
    static from(lookup) {
        if (lookup instanceof ContextPath) {
            return lookup;
        }
        if (typeof lookup !== 'string') {
            throw new Error(
                `Internal error: Cannot build ContextPath from non-string ${lookup}`
            );
        }
        if (illegalPathChars.test(lookup)) {
            throw new Error(
                `Illegal context property name found: ${lookup}\nContext properties must be dot-separated strings and contain no special characters, and cannot begin with a dot.`
            );
        }
        if (contextPathCache.has(lookup)) {
            return contextPathCache.get(lookup);
        }
        const segments = lookup.split('.');
        const path = segments.reduce(
            (parent, newSegment) => parent.extend(newSegment),
            ContextPath.root
        );
        contextPathCache.set(lookup, path);
        return path;
    }
    extend(newSegment) {
        const fullPath = this._segments.concat(newSegment);
        const fullPathString = fullPath.join('.');
        let path = contextPathCache.get(fullPathString);
        if (!path) {
            path = new ContextPath(fullPath);
            contextPathCache.set(fullPathString, path);
        }
        return path;
    }
    constructor(segments) {
        this._segments = segments;
    }
    base() {
        return this._segments[0];
    }
    getFrom(obj) {
        let current = obj;
        for (const segment of this._segments) {
            if (!current || !current.hasOwnProperty(segment)) {
                return '';
            }
            debug('traverse %s yields %s', segment, current[segment]);
            current = current[segment];
        }
        return current;
    }
    // contains(otherPath) {
    //     return this._segments.every((segment, i) => otherPath.keyAt(i) === i);
    // }
    // containsSegment(segment) {
    //     return this._segments.some(mySegment => mySegment === segment);
    // }
    // depth() {
    //     return this._segments.length;
    // }
    // keyAt(index) {
    //     return this._segments[index];
    // }
    // relative(ancestor) {
    //     return this._segments.slice(ancestor.depth());
    // }
    toString() {
        return this._segments.join('.');
    }
}

ContextPath.root = new ContextPath([]);

module.exports = ContextPath;
