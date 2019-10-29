const debug = require('../util/debug').makeFileLogger(__filename);
const { relative, resolve } = require('path');
const micromatch = require('micromatch');
const findPackageRoot = require('./findPackageRoot');
const getBuildpackInstructions = require('./getBuildpackInstructions');
const fse = require('fs-extra');
const gitIgnoreToGlob = require('gitignore-to-glob');

const isMatch = (path, globs) => micromatch.isMatch(path, globs, { dot: true });

// Common handlers that a template developer might frequently use for globs,
// provided for the developer's convenience.
const makeCommonTasks = (fs, options) => ({
    Ignore() {},
    Copy({ stats, path, targetPath }) {
        if (stats.isDirectory()) {
            fs.ensureDirSync(targetPath);
        } else {
            fs.copyFileSync(path, targetPath);
        }
    },
    async Create(overrideOptions) {
        const allOptions = Object.assign({}, options, overrideOptions);
        if (overrideOptions.template) {
            allOptions.template =
                (await findPackageRoot.local(overrideOptions.template)) ||
                (await findPackageRoot.remote(overrideOptions.template));
        }
        return createProject(allOptions);
    },
    EditJson(callback, opts = {}) {
        return async params => {
            const { path, targetPath } = params;
            let target;
            try {
                target = await fs.readJson(targetPath);
            } catch (e) {
                target = {};
            }
            const source = await fs.readJson(path);
            const edited = await callback({
                ...params,
                source,
                target
            });
            await fs.outputJson(targetPath, edited, {
                spaces: 2,
                ...opts
            });
        };
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
    ignores = [],
    visitor
}) =>
    new Promise((succeed, fail) => {
        const copyGlobs = Object.keys(visitor);
        const visit = async ({ stats, path }) => {
            const relativePath = relative(packageRoot, path);
            const targetPath = resolve(directory, relativePath);
            const pattern = copyGlobs.find(glob => isMatch(relativePath, glob));
            if (pattern) {
                debug(`visit: ${path} matches ${pattern}`);
                await visitor[pattern]({
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

        copyStream.on('readable', async function() {
            let item;
            while (!failed && (item = this.read())) {
                debug(`visiting ${item.path}`);
                try {
                    await visit(item);
                } catch (e) {
                    failed = true;
                    fail(e);
                }
            }
        });
        copyStream.on('error', () => {
            failed = true;
            fail();
        });
        copyStream.on('end', () => {
            if (!failed) {
                succeed();
            }
        });
    });

async function createProject(options) {
    const { template, directory } = options;

    const { instructions, packageRoot } = await getBuildpackInstructions(
        template,
        ['create']
    );
    const {
        after,
        before,
        visitor,
        ignores = getIgnores(packageRoot)
    } = instructions.create({
        fs: fse,
        tasks: makeCommonTasks(fse, options),
        options,
        findPackageRoot,
        makeCopyStream
    });

    if (before) {
        await before({ options });
    }
    await makeCopyStream({
        fs: fse,
        packageRoot,
        directory,
        options,
        ignores,
        visitor
    });
    if (after) {
        await after({ options });
    }
}

module.exports = createProject;
module.exports.makeCopyStream = makeCopyStream;
module.exports.makeCommonTasks = makeCommonTasks;
module.exports.GITIGNORE_FILE = '.gitignore';
