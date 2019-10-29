const { relative } = require('path');
const micromatch = require('micromatch');
const walk = require('../util/klaw-bound-fs');
const namedAsyncTaskQueue = require('./namedAsyncTaskQueue');
const isMatch = (path, globs) => micromatch.isMatch(path, globs, { dot: true });

class CombinedFsWalker {
    constructor({ fs, target, jobs }) {
        this.fs = fs;
        this.target = target;
        this.jobs = jobs;
        this.operationsByTarget = new Map();
    }
    async run() {
        const self = this;
        await Promise.all(
            this.jobs.map(
                ({ root, visitor, ignores }) =>
                    new Promise((resolve, reject) => {
                        const walker = walk(root, {
                            fs,
                            filter: p =>
                                !isMatch(p, ignores) &&
                                !isMatch(relative(root, p), ignores)
                        });
                        walker.on('readable', async function() {
                            let item;
                            while (!self.failed && (item = this.read())) {
                                debug(`${root} visitor hit ${item.path}`);
                                self._visit(item, visitor, root);
                            }
                        });
                        walker.on('error', e => {
                            self.failed = true;
                            reject(
                                new Error(`${root} walker failed: ${e.stack}`)
                            );
                        });
                        walker.on('end', () => {
                            resolve();
                        });
                    })
            )
        );
        await Promise.all(
            [...this.operationsByTarget.values()].map(
                queue =>
                    new Promise((resolve, reject) => {
                        if (queue.isEmpty()) {
                            resolve();
                        }
                        queue.on('error', reject);
                        queue.on('empty', resolve);
                    })
            )
        );
    }
    async _visit({ stats, path }, visitor, packageRoot) {
        const copyGlobs = Object.keys(visitor);
        const relativePath = relative(packageRoot, path);
        const targetPath = resolve(directory, relativePath);
        const targetQueue = this._getTargetQueue(targetPath);
        const pattern = copyGlobs.find(glob => isMatch(relativePath, glob));
        if (pattern) {
            debug(`visit: ${path} matches ${pattern}`);
            targetQueue.push(async () =>
                visitor[pattern]({
                    stats,
                    path,
                    targetPath,
                    options
                })
            );
        } else {
            debug(`visit: ${path} matches no pattern in ${copyGlobs}`);
        }
    }
    _getTargetQueue(targetPath) {
        let queue = this.operationsByTarget.get(targetPath);
        if (!queue) {
            queue = namedAsyncTaskQueue(`writing to ${targetPath}`);
            this.operationsByTarget.set(targetPath, queue);
        }
        return queue;
    }
}

module.exports = CombinedFsWalker;
