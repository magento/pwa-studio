const fetch = require('node-fetch');
const path = require('path');
const tap = require('tap');

const { getScenarios, runServer, assertOnResponse } = require('../../');

tap.test('Static servers', async sub => {
    const scenarios = await getScenarios(/static\-servers/);

    await sub.test('Static Hello World with only inline deps', async t => {
        const server = await runServer(
            t,
            scenarios.getResourcePath('./hello-inline-only.yml')
        );

        if (server.assert('launched')) {
            const response = await fetch(server.url);

            await assertOnResponse(t, response, {
                status: 200,
                headers: {
                    'content-type': 'text/plain'
                },
                text: 'Hello World!!'
            });

            server.assert('crashed', false);
        }

        await server.close();
    });

    await sub.test('Static Hello World with implicit resolvers', async t => {
        const server = await runServer(
            t,
            scenarios.getResourcePath('./hello-inline-implicit-resolvers.yml')
        );

        if (server.assert('launched')) {
            const response = await fetch(server.url);

            await assertOnResponse(t, response, {
                status: 200,
                headers: {
                    'content-type': 'text/plain'
                },
                text: 'Hello World, concisely!!'
            });

            server.assert('crashed', false);
        }

        await server.close();
    });

    await sub.test('Static Hello World with env interpolation', async t => {
        const server = await runServer(
            t,
            scenarios.getResourcePath('./hello-env-interpolation.yml'),
            {
                UPWARD_TEST_RESPONSE_BODY: 'Hello, environment!!'
            }
        );

        if (server.assert('launched')) {
            const response = await fetch(server.url);

            await assertOnResponse(t, response, {
                status: 200,
                headers: {
                    'content-type': 'text/plain'
                },
                text: 'Hello, environment!!'
            });

            server.assert('crashed', false);
        }
        await server.close();
    });

    await sub.test(
        'Static Hello World with env dep and inline template',
        async t => {
            const server = await runServer(
                t,
                scenarios.getResourcePath('./hello-env-inline-template.yml'),
                {
                    ADDRESSEE: 'Terra'
                }
            );

            if (server.assert('launched')) {
                const response = await fetch(server.url);

                await assertOnResponse(t, response, {
                    status: 200,
                    headers: {
                        'content-type': 'text/plain'
                    },
                    text: 'Hello, environment of Terra!!'
                });

                server.assert('crashed', false);
            }

            await server.close();
        }
    );

    await sub.test(
        'Static Hello World with env, context, and file template',
        async t => {
            const server = await runServer(
                t,
                scenarios.getResourcePath(
                    './hello-env-context-file-template.yml'
                ),
                {
                    sender: 'planet'
                }
            );

            if (server.assert('launched')) {
                const response = await fetch(server.url);

                await assertOnResponse(t, response, {
                    status: 200,
                    headers: {
                        'content-type': 'text/plain'
                    },
                    text: 'Hello from a planet of external templates!!'
                });

                server.assert('crashed', false);
            }

            await server.close();
        }
    );
    await sub.test(
        'Static JSON Hello World with template partial resolution',
        async t => {
            const server = await runServer(
                t,
                scenarios.getResourcePath(
                    './hello-context-inline-template-json.yml'
                ),
                {
                    ADDRESSEE: 'deep space'
                }
            );
            if (server.assert('launched')) {
                const response = await fetch(server.url);

                await assertOnResponse(t, response, {
                    status: 200,
                    headers: {
                        'content-type': 'application/json'
                    },
                    json: {
                        greeting: 'Hello',
                        subject: 'the depths of deep space...'
                    }
                });

                server.assert('crashed', false);
            }

            await server.close();
        }
    );
});
