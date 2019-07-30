const debug = require('../util/debug').makeFileLogger(__filename);
const { relative, resolve } = require('path');
const fse = require('fs-extra');
const walk = require('klaw');
const micromatch = require('micromatch');

function getBuildpackInstructions(template) {
    const instructionFolder = resolve(template, '.buildpack');
    try {
        return {
            create: require(resolve(instructionFolder, 'create'))
        };
    } catch (e) {
        throw new Error(
            `Buildpack createProject('${template}') could not find a valid './.buildpack/create.js' file in that directory. This file must be present to instruct Buildpack how to copy the template files into a new directory.`
        );
    }
}

function createProject(options) {
    const { template, directory } = options;

    const instructions = getBuildpackInstructions(template);
    const { after, visitor } = instructions.create(fse);

    const copyGlobs = Object.keys(visitor);
    const visit = ({ stats, path }) => {
        const relativePath = relative(template, path);
        const targetPath = resolve(directory, relativePath);
        const pattern = copyGlobs.find(glob =>
            micromatch.isMatch(relativePath, glob, { dot: true })
        );
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
        copyStream.on('end', async () => {
            if (after) {
                try {
                    await after({ options });
                } catch (e) {
                    fail(e);
                }
                succeed();
            }
        });
    });
}

module.exports = createProject;
