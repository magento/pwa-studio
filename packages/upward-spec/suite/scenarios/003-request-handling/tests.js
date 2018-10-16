const { URL } = require('url');
const fetch = require('node-fetch');
const tape = require('tape');

const { getScenarios, runServer, assertOnResponse } = require('../../');

const gettingScenarios = getScenarios(/request\-handling/);

tape.test('Reflect request', async t => {
    const scenarios = await gettingScenarios;
    const server = await runServer(
        t,
        scenarios.getResourcePath('./reflect-request.yml')
    );

    if (server.assert('launched')) {
        const response = await fetch(
            new URL('/some/path?query=parameters', server.url)
        );

        await assertOnResponse(t, response, {
            status: 200,
            headers: {
                'content-type': 'text/plain'
            },
            text: 'some/path'
        });

        server.assert('crashed', false);
    }

    await server.close();
    t.end();
});
