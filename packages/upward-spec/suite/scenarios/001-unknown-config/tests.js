const tape = require('tape');

const { getScenarios, runServer } = require('../../');

const gettingScenarios = getScenarios(/unknown\-config/);

tape.test('Crashes if config file is missing', async t => {
    const scenarios = await gettingScenarios;
    const server = await runServer(
        t,
        scenarios.getResourcePath('./absolutely-no-way-this-file-exists')
    );

    server.assert('crashed');

    await server.close();
    t.end();
});

tape.test('Crashes if config file is unparseable', async t => {
    const scenarios = await gettingScenarios;
    const server = await runServer(
        t,
        scenarios.getResourcePath('./unparseable.yml')
    );

    server.assert('crashed');

    await server.close();
    t.end();
});
