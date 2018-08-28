const { Test } = require('tap');
const getScenarios = require('./getScenarios');
const ServerRunner = require('./ServerRunner');

module.exports = async function runner({
    script,
    serverTimeout,
    runOnlyMatching = []
}) {
    const serverRunner = new ServerRunner(script, serverTimeout);
    await serverRunner.checkPermissions();
    const t = new Test({
        name: `UPWARD spec tested against ${script}`,
        jobs: 1,
        grep: runOnlyMatching.map(s => new RegExp(s)),
        diagnostic: true
    });
    let dead;
    const die = e => {
        dead = true;
        t.bailout(e);
    };

    const allTests = [];

    const scenarios = await getScenarios(runOnlyMatching);

    for (const scenario of scenarios) {
        if (dead) {
            break;
        }
        // we don't want to await these promises, we want them concurrent
        allTests.push(
            scenario
                .setup({ serverRunner, die })
                .then(() => scenario.runWith(t, serverRunner))
        );
    }
    return t;
};
