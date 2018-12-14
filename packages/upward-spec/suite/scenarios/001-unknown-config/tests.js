const tape = require('tape');

const { getScenarios, runServer } = require('../../');

const scenarios = getScenarios(/unknown\-config/);

tape.test('Crashes if config file is missing', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./absolutely-no-way-this-file-exists'),
        server => server.assert('crashed')
    );
});

tape.test('Crashes if config file is unparseable', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./unparseable.yml'),
        server => server.assert('crashed')
    );
});
