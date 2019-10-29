const debug = require('debug')('memFsExtraMock');
const path = require('path');
const realFs = require('fs');
const { createFsFromVolume, Volume } = require('memfs');

// This is the best way to do this: gather the fs methods supported by native fs
// if the `fs` object in Node ever changes so these methods aren't own-props,
// this method will break
const fsMethods = Object.keys(realFs).filter(
    methodName =>
        // we only want functions
        typeof realFs[methodName] === 'function'
);

// memfs does not promisify very well, so we do it ourselves, but only with...
const fsMethodsToPromisify = fsMethods.filter(
    methodName =>
        // CapitalFirstLetter means constructor functions, we don't want those
        !/^[A-Z]/.test(methodName) &&
        // not the createStream functions
        !methodName.startsWith('create') &&
        // sync functions
        !methodName.endsWith('Sync')
);

const syncFsMethods = fsMethods.filter(methodName =>
    methodName.endsWith('Sync')
);
// class MockFS {
//     _track() {
//         const instances = this.constructor.instances;
//         this.num = instances.length + 1;
//         const e = new Error(`TrackingFS ${this.num} instantiated`);
//         instances.push({
//             instance: this,
//             trace: e.stack
//         });
//     }
//     _bindFsMethods() {
//         fsMethods.forEach(name => {
//             if (typeof this.fs[name] !== 'function') {
//                 return;
//             }
//             if (fsMethodsToPromisify.has(name)) {
//                 this[name] = promisify(this.fs[name].bind(this.fs));
//             } else {
//                 this[name] = this.fs[name].bind(this.fs);
//             }
//         });
//     }
//     async ensureDir(dir) {
//         return new Promise((res, rej) =>
//             this.fs.mkdirp(dir, (err, result) => (err ? rej(err) : res(result)))
//         );
//     }
//     ensureDirSync(dir) {
//         return this.fs.mkdirpSync(dir);
//     }
//     async readJson(sourcePath, options) {
//         const text = await this.readFile(sourcePath, options);
//         console.error(`we have now read text for ${sourcePath}`);
//         return JSON.parse(text);
//     }
//     readJsonSync(path, ...args) {
//         try {
//             debugger;
//             return JSON.parse(this.readFileSync(path, ...args));
//         } catch (e) {
//             const insts = MockFS.instances;
//             let situation = `Okay, ${
//                 insts.length
//             } instances have been created\n`;
//             insts.forEach(({ instance, trace }) => {
//                 if (instance === this) {
//                     situation += 'THIS INSTANCE THREW!!!';
//                 }
//                 situation += `Instance ${
//                     instance.num
//                 } contains: \n${JSON.stringify(
//                     this.vol.toJSON(),
//                     null,
//                     2
//                 )}\n\nand was constructed:\n${trace}\n`;
//             });
//             throw new Error(`${situation} ${path}: ${e.message}`);
//         }
//     }
//     async outputFile(path, content, enc) {
//         await this.ensureDir(dirname(path));
//         console.error(
//             'about to call writeFile on instance ${this.num}',
//             path,
//             ...args
//         );
//         await this.writeFile(path, content, enc);
//     }
//     outputFileSync(path, ...args) {
//         this.mkdirpSync(dirname(path));
//         console.error(
//             'about to call writeFileSync on instance ${this.num}',
//             path,
//             ...args
//         );
//         return this.writeFileSync(path, ...args);
//     }
//     async outputJson(path, json, opts) {
//         const content = JSON.stringify(json, null, opts && opts.spaces);
//         await this.outputFile(path, content, 'utf8');
//     }
//     outputJsonSync(path, json, opts) {
//         this.outputFileSync(
//             path,
//             JSON.stringify(json, null, opts && opts.spaces)
//         );
//     }
//     async copyFile(sourcePath, targetPath, options) {
//         const contents = await this.readFile(sourcePath, options);
//         await this.writeFile(targetPath, contents, options);
//     }
//     copyFileSync(sourcePath, targetPath, options) {
//         this.outputFileSync(targetPath, fs.readFileSync(sourcePath, options));
//     }
// }

module.exports = function memFsExtraMock(files) {
    const vol = Volume.fromJSON(files);
    const memFs = createFsFromVolume(vol);

    const fseMethods = {
        ensureDir(...args) {
            return new Promise((res, rej) =>
                this.mkdir(...args, { recursive: true }, (err, result) =>
                    err ? rej(err) : res(result)
                )
            );
        },
        ensureDirSync(dirname) {
            return this.mkdirSync(dirname, { recursive: true });
        },
        async outputJson(filepath, json, opts = {}) {
            const fileContents = JSON.stringify(json, null, opts.spaces);
            await this.ensureDir(path.dirname(filepath));
            await this.writeFile(filepath, fileContents);
        },
        async readJson(filepath) {
            const fileContents = await this.readFile(filepath);
            return JSON.parse(fileContents);
        },
        readJsonSync(filepath) {
            return JSON.parse(this.readFileSync(filepath));
        }
    };

    class MockFSError extends Error {
        constructor(...args) {
            super(...args);
            Error.captureStackTrace(this, MockFSError);
            this.message += `\nfs state: ${JSON.stringify(
                vol.toJSON(),
                null,
                2
            )}`;
        }
    }

    const descriptors = {};
    for (const [name, value] of Object.entries(fseMethods)) {
        descriptors[name] = {
            value
        };
    }
    for (const name of fsMethodsToPromisify) {
        descriptors[name] = {
            value: function() {
                const oldArgs = [...arguments];
                const maybeCb = arguments[arguments.length - 1];
                if (typeof maybeCb === 'function') {
                    // memFs probably calling itself and passing a callback
                    const newArgs = [
                        ...oldArgs.slice(0, oldArgs.length - 1),
                        (err, result) =>
                            maybeCb(err ? new MockFSError(err) : null, result)
                    ];
                    return memFs[name].apply(this, newArgs);
                }
                // if we are here, then presumably, we must promisify
                return new Promise((res, rej) => {
                    const newArgs = [
                        ...oldArgs,
                        (err, result) => {
                            debug(
                                `PROMISIFIED CALLBACK .${name}(${newArgs}), %o`,
                                { err, result }
                            );
                            if (err) {
                                rej(new MockFSError(err));
                            }
                            res(result);
                        }
                    ];
                    debug(`PROMISIFIED .${name}(${newArgs})`);
                    return memFs[name].apply(this, newArgs);
                });
            }
        };
    }
    for (const name of syncFsMethods) {
        descriptors[name] = {
            value: function() {
                try {
                    return memFs[name].apply(this, arguments);
                } catch (e) {
                    throw new MockFSError(e);
                }
            }
        };
    }

    return Object.create(memFs, descriptors);
};

//     const bindFsMethod = (context, methodName) => {
//         function runBound() {
//             const self = this || context; // memFs may want to apply it
//             debug(
//                 `unpromisified .${methodName}, this === context ? ${this === context}`
//             );
//             return context[methodName].apply(self, arguments);
//         }
//         if (!fsMethodsToPromisify.has(methodName)) {
//             return runBound;
//         }
//     };

//     const me = new Proxy(memFs, {
//         get(_, name) {
//             if (typeof fseMethods[name] === 'function') {
//                 return (...args) => fseMethods[name].apply(me, args);
//             }
//             if (typeof memFs[name] === 'function') {
//                 return (bound[name] = bound[name] || bindFsMethod(me, name));
//             }
//             return memFs[name];
//         }
//     });

//     return me;
// };
