const { resolve } = require('path');
const { promisify } = require('util');
const fs = require('fs');

const ScenarioHarness = require('./ScenarioHarness');

const readdir = promisify(fs.readdir);

module.exports = async function getScenarios(runOnlyMatching) {
    const scenariosBaseDir = resolve(__dirname, './scenarios');
    const scenarioDirs = await readdir(scenariosBaseDir);
    return (function*() {
        for (const dir of scenarioDirs) {
            if (
                runOnlyMatching.length === 0 ||
                !runOnlyMatching.some(pattern => pattern.test(dir))
            ) {
                yield new ScenarioHarness(resolve(scenariosBaseDir, dir));
            }
        }
    })();
};
