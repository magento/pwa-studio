const debug = require('../util/debug').makeFileLogger(__filename);
const { relative, resolve } = require('path');
const walk = require('klaw');
const micromatch = require('micromatch');

function createProject(options, copyVisitor) {
    const { template, directory } = options;

    const copyGlobs = Object.keys(copyVisitor);
    const visit = ({ stats, path }) => {
        const relativePath = relative(template, path);
        const targetPath = resolve(directory, relativePath);
        const pattern = copyGlobs.find(glob =>
            micromatch.isMatch(relativePath, glob, { dot: true })
        );
        if (pattern) {
            debug(`visit: ${path} matches ${pattern}`);
            copyVisitor[pattern]({
                stats,
                path,
                targetPath,
                options
            });
        } else {
            debug(`visit: ${path} matches no pattern in ${copyGlobs}`);
        }
    };

    return new Promise((succeed, fail) => {
        const copyStream = walk(template, {
            filter: p => !p.includes('node_modules/')
        });

        copyStream.on('readable', function() {
            let item;
            while ((item = this.read())) {
                debug(`visiting ${item.path}`);
                try {
                    visit(item);
                } catch (e) {
                    fail(e);
                }
            }
        });
        copyStream.on('error', fail);
        copyStream.on('end', succeed);
    });
}

module.exports = createProject;
