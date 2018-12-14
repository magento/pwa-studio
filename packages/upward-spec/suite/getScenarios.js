const { resolve } = require('path');
const {
    createReadStream,
    readdir: fsReaddir,
    readFile: fsReadFile
} = require('fs');
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

function getScenarios(pattern) {
    if (!pattern || typeof pattern.test !== 'function') {
        throw new Error(
            `UpwardSpec.getScenarios() requires a regular expression, or an object with a 'test' method`
        );
    }
    const baseDir = dirsPromise.then(candidates =>
        resolve(__dirname, './scenarios', getOneMatch(candidates, pattern))
    );

    async function getResourcePath(name) {
        return resolve(await baseDir, name);
    }

    async function getResource(name, enc = 'utf8') {
        return readFile(await getResourcePath(name), enc);
    }

    async function getResourceStream(name, enc = 'utf8') {
        return createReadStream(await getResourcePath(name), enc);
    }
    return {
        baseDir,
        getResource,
        getResourcePath,
        getResourceStream,
        async getDefinition(name) {
            return jsYaml.safeLoad(await getResource(name + '.yml'));
        }
    };
}

module.exports = getScenarios;
