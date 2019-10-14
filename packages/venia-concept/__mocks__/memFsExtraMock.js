const { createFsFromVolume, Volume } = require('memfs');

// // util.promisify doesn't work on memfs because, i don't know
// const promisify = fn => (...args) =>
//     new Promise((res, rej) =>
//         fn(...args, (err, result) => (err ? rej(err) : res(result)))
//     );

// // This is the best way to do this: gather the fs methods supported by native fs
// // if the `fs` object in Node ever changes so these methods aren't own-props,
// // this method will break
// const fsMethods = Object.keys(realFs).filter(
//     methodName =>
//         // we only want functions
//         typeof realFs[methodName] === 'function'
// );

// // memfs does not promisify very well, so we do it ourselves, but only with...
// const fsMethodsToPromisify = new Set(
//     fsMethods.filter(
//         methodName =>
//             // CapitalFirstLetter means constructor functions, we don't want those
//             !/^[A-Z]/.test(methodName) &&
//             // not the createStream functions
//             !methodName.startsWith('create') &&
//             // sync functions
//             !methodName.endsWith('Sync')
//     )
// );

class MockFS {
    _track() {
        const instances = this.constructor.instances;
        this.num = instances.length + 1;
        const e = new Error(`TrackingFS ${this.num} instantiated`);
        instances.push({
            instance: this,
            trace: e.stack
        });
    }
    _bindFsMethods() {
        fsMethods.forEach(name => {
            if (typeof this.fs[name] !== 'function') {
                return;
            }
            if (fsMethodsToPromisify.has(name)) {
                this[name] = promisify(this.fs[name].bind(this.fs));
            } else {
                this[name] = this.fs[name].bind(this.fs);
            }
        });
    }
    async ensureDir(dir) {
        return new Promise((res, rej) =>
            this.fs.mkdirp(dir, (err, result) => (err ? rej(err) : res(result)))
        );
    }
    ensureDirSync(dir) {
        return this.fs.mkdirpSync(dir);
    }
    async readJson(sourcePath, options) {
        const text = await this.readFile(sourcePath, options);
        console.error(`we have now read text for ${sourcePath}`);
        return JSON.parse(text);
    }
    readJsonSync(path, ...args) {
        try {
            debugger;
            return JSON.parse(this.readFileSync(path, ...args));
        } catch (e) {
            const insts = MockFS.instances;
            let situation = `Okay, ${
                insts.length
            } instances have been created\n`;
            insts.forEach(({ instance, trace }) => {
                if (instance === this) {
                    situation += 'THIS INSTANCE THREW!!!';
                }
                situation += `Instance ${
                    instance.num
                } contains: \n${JSON.stringify(
                    this.vol.toJSON(),
                    null,
                    2
                )}\n\nand was constructed:\n${trace}\n`;
            });
            throw new Error(`${situation} ${path}: ${e.message}`);
        }
    }
    async outputFile(path, content, enc) {
        await this.ensureDir(dirname(path));
        console.error(
            'about to call writeFile on instance ${this.num}',
            path,
            ...args
        );
        await this.writeFile(path, content, enc);
    }
    outputFileSync(path, ...args) {
        this.mkdirpSync(dirname(path));
        console.error(
            'about to call writeFileSync on instance ${this.num}',
            path,
            ...args
        );
        return this.writeFileSync(path, ...args);
    }
    async outputJson(path, json, opts) {
        const content = JSON.stringify(json, null, opts && opts.spaces);
        await this.outputFile(path, content, 'utf8');
    }
    outputJsonSync(path, json, opts) {
        this.outputFileSync(
            path,
            JSON.stringify(json, null, opts && opts.spaces)
        );
    }
    async copyFile(sourcePath, targetPath, options) {
        const contents = await this.readFile(sourcePath, options);
        await this.writeFile(targetPath, contents, options);
    }
    copyFileSync(sourcePath, targetPath, options) {
        this.outputFileSync(targetPath, fs.readFileSync(sourcePath, options));
    }
}


    module.exports = function mockFsExtra(initialState) {
        const vol = Volume.fromJSON(initialState);
        const fs = createFsFromVolume(ol);
        const bound = {};
            // explicitly bind argument length, because these virtual filesystems
    // we use in testing are sometimes touchy about it. We know that all the
    // fs methods have three arguments maximum for this use case.
    const bindFsMethod = methodName => (a1, a2, a3) =>
    fs[methodName](a1, a2, a3);
        return new Proxy(fs, {
            get(_, methodName) {
                if (typeof fs[methodName] !== 'function')
                if (methodName.endsWith('Sync')) {
                    return
                }
            }
        })
    }
