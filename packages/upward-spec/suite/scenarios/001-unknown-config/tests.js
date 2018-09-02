const fs = require('fs');
const tap = require('tap');

const runServer = require('../../run-server.js');

tap.test('Unknown or unreadable config', async sub => {
    await Promise.all([
        sub.test('Crashes if config file is missing', async t => {
            const server = await runServer(
                t,
                './absolutely-no-way-this-file-exists'
            );
            server.assert('crashed');
            await server.close();
        }),
        sub.test('Crashes if config file cannot be read', async t => {
            const unreadable = require.resolve('./unreadable.yml');
            fs.chmodSync(unreadable, 200);
            const server = await runServer(t, unreadable);
            fs.chmodSync(unreadable, 644);
            server.assert('crashed');
            await server.close();
        }),
        sub.test('Crashes if config file is unparseable', async t => {
            const server = await runServer(
                t,
                require.resolve('./unparseable.yml')
            );
            server.assert('crashed');
            await server.close();
        })
    ]);
});
