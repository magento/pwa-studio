const { resolve } = require('path');
const { readdir: fsReaddir, readFile: fsReadFile } = require('fs');
const { promisify } = require('util');
const jsYaml = require('js-yaml');
const readdir = promisify(fsReaddir);
const readFile = promisify(fsReadFile);

const dirsPromise = readdir(resolve(__dirname, './scenarios'));

function getOneMatch(candidates, pattern) {
    const matching = candidates.filter(candidate => pattern.test(candidate));
    if (matching.length > 1) {
        throw new Error(
            `${pattern.toString()} returned multiple results: ${matching.join()}`
        );
    }
    if (matching.length === 0) {
        throw new Error(`${pattern.toString()} returned no results`);
    }
    return matching[0];
}

async function getScenarios(pattern) {
    if (!pattern || typeof pattern.test !== 'function') {
        throw new Error(
            `UpwardSpec.getScenarios() requires a regular expression, or an object with a 'test' method`
        );
    }
    const baseDir = await resolve(
        __dirname,
        './scenarios',
        getOneMatch(await dirsPromise, pattern)
    );

    function getResourcePath(name) {
        return resolve(baseDir, name);
    }

    function getResource(name, enc = 'utf8') {
        return readFile(getResourcePath(name), enc);
    }
    return {
        baseDir,
        getResourcePath,
        getResource,
        async getDefinition(name) {
            return jsYaml.safeLoad(await getResource(name + '.yml'));
        }
    };
}

module.exports = getScenarios;
