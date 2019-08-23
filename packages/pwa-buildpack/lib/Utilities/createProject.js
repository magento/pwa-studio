const debug = require('../util/debug').makeFileLogger(__filename);
const { relative, resolve } = require('path');
const walk = require('../util/klaw-bound-fs');
const micromatch = require('micromatch');
const getBuildpackInstructions = require('./getBuildpackInstructions');
const fse = require('fs-extra');
const gitIgnoreToGlob = require('gitignore-to-glob');

const isMatch = (path, globs) => micromatch.isMatch(path, globs, { dot: true });

const defaultIgnores = ['node_modules/**/*'];

const getIgnores = packageRoot => {
    try {
        return (
            gitIgnoreToGlob(
                resolve(packageRoot, createProject.GITIGNORE_FILE),
                packageRoot
            )
                // these come out as negations, but let's remove that because we'll be
                // matching them positively in order to skip them
                .map(glob => glob.replace(/^!/, ''))
        );
    } catch (e) {
        return defaultIgnores;
    }
};

const makeCopyStream = ({
    fs,
    packageRoot,
    directory,
    options,
    ignores,
    visitor,
    after
}) =>
    new Promise((succeed, fail) => {
        const copyGlobs = Object.keys(visitor);
        const visit = ({ stats, path }) => {
            const relativePath = relative(packageRoot, path);
            const targetPath = resolve(directory, relativePath);
            const pattern = copyGlobs.find(glob => isMatch(relativePath, glob));
            if (pattern) {
                debug(`visit: ${path} matches ${pattern}`);
                visitor[pattern]({
                    stats,
                    path,
                    targetPath,
                    options
                });
            } else {
                debug(`visit: ${path} matches no pattern in ${copyGlobs}`);
            }
        };
        let failed = false;
        const copyStream = walk(packageRoot, {
            fs,
            filter: p =>
                !isMatch(relative(packageRoot, p), ignores) &&
                !isMatch(p, ignores)
        });

        copyStream.on('readable', function() {
            let item;
            while (!failed && (item = this.read())) {
                debug(`visiting ${item.path}`);
                try {
                    visit(item);
                } catch (e) {
                    failed = true;
                    fail(e);
                }
            }
        });
        copyStream.on('error', fail);
        copyStream.on('end', () => {
            if (after) {
                try {
                    after({ options });
                    succeed();
                } catch (e) {
                    failed = true;
                    fail(e);
                }
            } else {
                succeed();
            }
        });
    });

function createProject(options) {
    const { template, directory } = options;

    const { instructions, packageRoot } = getBuildpackInstructions(template, [
        'create'
    ]);
    const {
        after,
        visitor,
        ignores = getIgnores(packageRoot)
    } = instructions.create({ fs: fse });

    return makeCopyStream({
        fs: fse,
        packageRoot,
        directory,
        options,
        ignores,
        visitor,
        after
    });
}

module.exports = createProject;
module.exports.makeCopyStream = makeCopyStream;
module.exports.GITIGNORE_FILE = '.gitignore';
