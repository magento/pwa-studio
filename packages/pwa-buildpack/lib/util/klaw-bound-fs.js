/**
 * TODO: klaw calls some methods out of context, breaking `this` references
 * inside fs implementations that rely on `this`. So we need to bind it to its
 * `this` here. Need to open a small PR to node-klaw.
 */

const klaw = require('klaw');

function bindFsMethodsForKlaw(fs) {
    const bound = {};
    // explicitly bind argument length, because these virtual filesystems
    // we use in testing are sometimes touchy about it. We know that all the
    // fs methods have three arguments maximum for this use case.
    const bindFsMethod = methodName => (a1, a2, a3) =>
        fs[methodName](a1, a2, a3);

    // Return a proxy because again, virtual filesystems are touchy about
    // object identity. This will bind methods on the fly and return the bound
    // method just from the dot lookup (e.g. statFunction = fs.stat);
    return new Proxy(fs, {
        get(_, name) {
            if (typeof fs[name] === 'function') {
                return (bound[name] = bound[name] || bindFsMethod(name));
            }
            return fs[name];
        }
    });
}

module.exports = function klawWithBoundFs(dir, options) {
    if (options.fs) {
        options.fs = bindFsMethodsForKlaw(options.fs);
    }
    return klaw(dir, options);
};
