const { resolve, extname } = require('path');
const { readdir: fsReaddir } = require('fs');
const { promisify } = require('util');
const readdir = promisify(fsReaddir);

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

async function getScenarioDir(pattern) {
    if (!pattern || typeof pattern.test !== 'function') {
        throw new Error(
            `UpwardSpec.getScenarioDir() requires a regular expression, or an object with a 'test' method`
        );
    }
    return resolve(
        __dirname,
        './scenarios',
        getOneMatch(await dirsPromise, pattern)
    );
}

async function getScenario(dirPattern, yamlPattern) {
    if (!yamlPattern || typeof yamlPattern.test !== 'function') {
        throw new Error(
            `UpwardSpec.getScenario() requires two regular expressions, or objects with a 'test' method, for scenario dir and yaml file`
        );
    }

    const scenarioDir = await getScenarioDir(dirPattern);

    const files = await readdir(scenarioDir);

    const yamlFiles = files.filter(file => extname(file) === '.yml');

    return resolve(scenarioDir, getOneMatch(yamlFiles, yamlPattern));
}

module.exports = {
    getScenarioDir,
    getScenario,
    mockGQLService: require('./mockGQLService'),
    runServer: require('./runServer')
};
