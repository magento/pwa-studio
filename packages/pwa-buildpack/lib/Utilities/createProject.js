const debug = require('../util/debug').makeFileLogger(__filename);
const { relative, resolve } = require('path');
const walk = require('../util/klaw-bound-fs');
const micromatch = require('micromatch');
const getBuildpackInstructions = require('./getBuildpackInstructions');
const fse = require('fs-extra');
const gitIgnoreToGlob = require('gitignore-to-glob');
const sampleBackends = require('../../sampleBackends.json');

const isMatch = (path, globs) => micromatch.isMatch(path, globs, { dot: true });

// Common handlers that a template developer might frequently use for globs,
// provided for the developer's convenience.
const makeCommonTasks = fs => ({
    IGNORE: () => {},
    COPY: ({ stats, path, targetPath }) => {
        if (stats.isDirectory()) {
            fs.ensureDirSync(targetPath);
        } else {
            fs.copyFileSync(path, targetPath);
        }
    }
});

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
                // and remove brackets while we're at it, since they break everything
                .map(glob => glob.replace(/^!/, '').replace(/{(.+)}/, '$1'))
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
    visitor
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

        copyStream.on('error', e => {
            failed = true;
            fail(e);
        });
        copyStream.on('readable', function() {
            let item;
            while (!failed && (item = this.read())) {
                debug(`visiting ${item.path}`);
                try {
                    visit(item);
                } catch (e) {
                    this.emit('error', e);
                    break;
                }
            }
        });
        copyStream.on('end', () => {
            if (!failed) {
                succeed();
            }
        });
    });

async function createProject(options) {
    const { template, directory } = options;

    const { instructions, packageRoot } = getBuildpackInstructions(template, [
        'create'
    ]);

    const {
        after = () => {},
        before = () => {},
        ignores = getIgnores(packageRoot),
        visitor
    } = await instructions.create({
        fs: fse,
        tasks: makeCommonTasks(fse),
        options,
        sampleBackends
    });
    await before({ options });
    await makeCopyStream({
        fs: fse,
        packageRoot,
        directory,
        options,
        ignores,
        visitor
    });
    await after({ options });
}

module.exports = createProject;
module.exports.makeCopyStream = makeCopyStream;
module.exports.makeCommonTasks = makeCommonTasks;
module.exports.GITIGNORE_FILE = '.gitignore';
