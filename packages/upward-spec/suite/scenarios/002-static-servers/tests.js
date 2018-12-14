const fetch = require('node-fetch');
const tape = require('tape');
const csvParse = require('csv-parse/lib/sync');
const asciify = require('asciify-image');

const { getScenarios, runServer, assertOnResponse } = require('../../');

const scenarios = getScenarios(/static\-servers/);

tape.test('Static Hello World with only inline deps', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./hello-inline-only.yml'),
        async server => {
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
        }
    );
});

tape.test('Static Hello World with implicit resolvers', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath(
            './hello-inline-implicit-resolvers.yml'
        ),
        async server => {
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
        }
    );
});

tape.test('Static Hello World with env interpolation', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./hello-env-interpolation.yml'),
        {
            UPWARD_TEST_RESPONSE_BODY: 'Hello, environment!!'
        },
        async server => {
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
        }
    );
});

tape.test('Static Hello World with env dep and inline template', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./hello-env-inline-template.yml'),
        {
            ADDRESSEE: 'Terra'
        },
        async server => {
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
        }
    );
});

tape.test(
    'Static Hello World with env, context, and file template',
    async t => {
        await runServer(
            t,
            await scenarios.getResourcePath(
                './hello-env-context-file-template.yml'
            ),
            {
                sender: 'planet'
            },
            async server => {
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
            }
        );
    }
);
tape.test(
    'Static JSON Hello World with template partial resolution',
    async t => {
        await runServer(
            t,
            await scenarios.getResourcePath(
                './hello-context-inline-template-json.yml'
            ),
            {
                ADDRESSEE: 'deep space'
            },
            async server => {
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
            }
        );
    }
);
tape.test('Binary file handling', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./hello-binary-file.yml'),
        async server => {
            if (server.assert('launched')) {
                const response = await fetch(server.url);

                await assertOnResponse(t, response, {
                    status: 200,
                    headers: {
                        'content-type': 'image/jpg'
                    }
                });

                const responseImg = await asciify(
                    new Buffer(await response.arrayBuffer()),
                    { fit: 'width', width: 50, color: false }
                );
                const fsImg = await asciify(
                    await scenarios.getResourcePath('sanic.jpg'),
                    { fit: 'width', width: 50, color: false }
                );
                t.equal(responseImg, fsImg);

                server.assert('crashed', false);
            }
        }
    );
});

tape.test('File shortcut resolution', async t => {
    await runServer(
        t,
        await scenarios.getResourcePath('./hello-file-shortcut.yml'),
        async server => {
            if (server.assert('launched')) {
                const response = await fetch(server.url);

                await assertOnResponse(t, response, {
                    status: 201,
                    headers: {
                        'content-type': 'text/csv',
                        'x-is-cool-swords': 'yep'
                    }
                });

                const swordsCSV = await response.text();
                try {
                    const swords = csvParse(swordsCSV, {
                        columns: true
                    }).reduce(
                        (acc, { name, origin }) => ((acc[origin] = name), acc),
                        {}
                    );

                    t.deepEqual(swords, {
                        scotland: 'claymore',
                        china: 'jian',
                        egypt: 'shotel'
                    });
                } catch (e) {
                    t.fail(
                        `swords.csv is valid CSV, but server emitted ${swordsCSV}, which did not parse: ${
                            e.message
                        }`
                    );
                }

                server.assert('crashed', false);
            }
        }
    );
});
