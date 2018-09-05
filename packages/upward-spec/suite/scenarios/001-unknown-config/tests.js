const fs = require('fs');
const path = require('path');
const tap = require('tap');

const { getScenarios, runServer } = require('../../');

tap.test('Unknown or unreadable config', async sub => {
    const scenarios = await getScenarios(/unknown\-config/);

    return Promise.all([
        sub.test('Crashes if config file is missing', async t => {
            const server = await runServer(
                t,
                scenarios.getResourcePath(
                    './absolutely-no-way-this-file-exists'
                )
            );

            server.assert('crashed');

            await server.close();
        }),

        sub.test('Crashes if config file cannot be read', async t => {
            const unreadable = scenarios.getResourcePath('./unreadable.yml');

            fs.chmodSync(unreadable, 0o200);

            const server = await runServer(t, unreadable);

            fs.chmodSync(unreadable, 0o644);

            server.assert('crashed');

            await server.close();
        }),

        sub.test('Crashes if config file is unparseable', async t => {
            const server = await runServer(
                t,
                scenarios.getResourcePath('./unparseable.yml')
            );

            server.assert('crashed');

            await server.close();
        })
    ]);
});
