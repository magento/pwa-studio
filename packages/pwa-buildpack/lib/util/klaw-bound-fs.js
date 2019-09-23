/**
 * TODO: klaw calls some methods out of context, breaking `this` references
 * inside fs implementations that rely on `this`. So we need to bind it to its
 * `this` here. Need to open a small PR to node-klaw.
 */

const klaw = require('klaw');

const methodNames = ['stat', 'lstat', 'readFile', 'readdir'];
const methodsToBind = [];
for (const method of methodNames) {
    methodsToBind.push(method, method + 'Sync');
}

function bindFsMethodsForKlaw(fs) {
    for (const methodName of methodsToBind) {
        const method = fs[methodName];
        fs[methodName] = (...args) => method.apply(fs, args);
    }
    return fs;
}

module.exports = function klawWithBoundFs(dir, options) {
    if (options.fs) {
        options.fs = bindFsMethodsForKlaw(options.fs);
    }
    return klaw(dir, options);
};
