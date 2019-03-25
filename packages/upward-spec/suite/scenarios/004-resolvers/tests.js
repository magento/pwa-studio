const { URL } = require('url');
const fetch = require('node-fetch');
const tape = require('tape');

const { getScenarios, runServer, assertOnResponse } = require('../../');

const gettingScenarios = getScenarios(/\d+-resolvers/);

tape.test('URLResolver extends base URLs producing absolute URLs', async t => {
    const scenarios = await gettingScenarios;
    const server = await runServer(
        t,
        scenarios.getResourcePath('./url-resolver-absolute.yml')
    );

    if (server.assert('launched')) {
        try {
            const response = await fetch(new URL('/?id=2', server.url), {
                timeout: process.env.TAP_TIMEOUT || 5000
            });
            await assertOnResponse(t, response, {
                status: 200,
                headers: {
                    'content-type': 'text/plain'
                },
                text: 'https://user:pass@example.com:3000/document/2'
            });
        } catch (e) {
            server.assert('responding', true);
        }
        server.assert('running', true);
    }

    await server.close();
    t.end();
});

tape.test('URLResolver allows protocol override', async t => {
    const scenarios = await gettingScenarios;
    const server = await runServer(
        t,
        scenarios.getResourcePath('./url-resolver-absolute-unsecure.yml')
    );

    const base = escape('https://example.com/scope');

    if (server.assert('launched')) {
        try {
            const response = await fetch(
                new URL('/?id=2&base=' + base, server.url),
                {
                    timeout: process.env.TAP_TIMEOUT || 5000
                }
            );
            await assertOnResponse(t, response, {
                status: 200,
                headers: {
                    'content-type': 'text/plain'
                },
                text: 'http://user:pass@example.com:3000/document/2'
            });
        } catch (e) {
            server.assert('responding', true);
        }
        server.assert('running', true);
    }

    await server.close();
    t.end();
});

tape.test(
    'URLResolver extends base URLs respecting relative paths',
    async t => {
        const scenarios = await gettingScenarios;
        const server = await runServer(
            t,
            scenarios.getResourcePath('./url-resolver-relative.yml')
        );

        if (server.assert('launched')) {
            try {
                const response = await fetch(new URL('/?id=3', server.url), {
                    timeout: process.env.TAP_TIMEOUT || 5000
                });
                await assertOnResponse(t, response, {
                    status: 200,
                    headers: {
                        'content-type': 'text/plain'
                    },
                    text: '/scope/document/3'
                });
            } catch (e) {
                server.assert('responding', true);
            }
            server.assert('running', true);
        }

        await server.close();
        t.end();
    }
);

tape.test(
    'URLResolver extends base URLs respecting slashes indicating root relative paths',
    async t => {
        const scenarios = await gettingScenarios;
        const server = await runServer(
            t,
            scenarios.getResourcePath('./url-resolver-root-relative.yml')
        );

        if (server.assert('launched')) {
            try {
                const response = await fetch(new URL('/?id=3', server.url), {
                    timeout: process.env.TAP_TIMEOUT || 5000
                });
                await assertOnResponse(t, response, {
                    status: 200,
                    headers: {
                        'content-type': 'text/plain'
                    },
                    text: '/document/3?foo=baz&guh=wuh'
                });
            } catch (e) {
                server.assert('responding', true);
            }
            server.assert('running', true);
        }

        await server.close();
        t.end();
    }
);

tape.test('URLResolver builds urls from templates', async t => {
    const scenarios = await gettingScenarios;
    const server = await runServer(
        t,
        scenarios.getResourcePath('./url-resolver-with-template.yml'),
        {
            ADMIN_REFRESH_TOKEN: 'a1b2c3',
            ADMIN_PORT: 8081,
            ADMIN_API_VERSION: 2
        }
    );

    const base = 'https://admin.host/api/rest';

    if (server.assert('launched')) {
        try {
            const response = await fetch(
                new URL(`/?adminApiBase=${base}/`, server.url),
                {
                    timeout: process.env.TAP_TIMEOUT || 5000
                }
            );
            await assertOnResponse(t, response, {
                status: 200,
                headers: {
                    'content-type': 'text/plain'
                },
                text:
                    'https://admin.host:8081/api/rest/v2/adminToken?refreshToken=a1b2c3&role=owner'
            });
        } catch (e) {
            server.assert('responding', true);
        }
        server.assert('running', true);
    }

    await server.close();
    t.end();
});
