const { URL } = require('url');
const fetch = require('node-fetch');
const tape = require('tape');

const { getScenarios, runServer, assertOnResponse } = require('../../');

const scenarios = getScenarios(/request\-handling/);

tape.test('Reflect request', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./reflect-request.yml'),
        async server => {
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
            }
            server.assert('crashed', false);
        }
    );
});
