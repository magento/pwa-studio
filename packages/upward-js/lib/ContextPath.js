const debug = require('debug')('upward-js:ContextPath');
// Tests for dot-separated strings of "word characters" or slashes.
// Slashes so that MIME type constants, like "text/html", can be legal values.
// "Word characters" are [a-zA-Z0-9_].
const illegalPathChars = /(^[\.\[\]])|[^\.\w\$\/]/;
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
                `Illegal context property name found: ${lookup}\nContext properties must be dot-separated strings and contain only letters, numbers, and underscores, and cannot begin with a dot.`
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
            if (Array.isArray(current)) {
                const index = Number(segment);
                if (!isNaN(index)) {
                    debug('array index %d yields %o', segment, current[index]);
                    if (current.length < index - 1) {
                        return '';
                    }
                    current = current[index];
                } else {
                    throw new Error(
                        `Attempted non-integer lookup on a list: ${current} [${segment}]`
                    );
                }
            } else if (current === undefined || current === null) {
                current = '';
                break;
            } else if (typeof current === 'object') {
                current = current[segment];
            } else {
                break;
            }
        }
        debug(
            'traverse %j yielded %j from %j',
            this._segments,
            current,
            obj[this.base()]
        );
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
