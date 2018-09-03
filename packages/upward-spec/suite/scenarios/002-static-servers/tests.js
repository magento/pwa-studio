const fetch = require('node-fetch');
const path = require('path');
const tap = require('tap');

const runServer = require('../../runServer.js');

tap.test('Static servers', async sub => {
    await sub.test('Static Hello World with only inline deps', async t => {
        const server = await runServer(
            t,
            path.resolve(__dirname, './hello-inline.yml')
        );
        if (server.assert('launched')) {
            const response = await fetch(server.url);
            t.equals(response.status, 200);
            t.equals(response.headers.get('content-type'), 'text/plain');
            const text = await response.text();
            server.assert('crashed', false);
            t.equals(text, 'Hello World!!');
        }
        await server.close();
    });
});

// module.exports = {
//     name: 'Static servers',
//     runTestsOn(serverRunner) {
//         return async t => {
//             await
//             // await t.test(
//             //     'Static Hello World with env dep and inline template',
//             //     async t => {
//             //         const server = await serverRunner.run(
//             //             require.resolve('./hello-env-inline-template.yml'),
//             //             {
//             //                 env: {
//             //                     ADDRESSEE: 'Terra'
//             //                 }
//             //             }
//             //         );
//             //         t.equals(server.crashed, false);
//             //         const response = await fetch(server.url);
//             //         t.equals(response.status, 200);
//             //         t.equals(
//             //             response.headers.get('content-type'),
//             //             'text/plain'
//             //         );
//             //         const text = await response.text();
//             //         t.equals(text, 'Hello, environment of Terra!!');
//             //         await server.close();
//             //     }
//             // );
//             // await t.test(
//             //     'Static JSON Hello World with inline template and context value',
//             //     async t => {
//             //         const server = await serverRunner.run(
//             //             require.resolve(
//             //                 './hello-context-inline-template-json.yml'
//             //             )
//             //         );
//             //         t.equals(server.crashed, false);
//             //         const response = await fetch(server.url);
//             //         t.equals(response.status, 200);
//             //         t.equals(
//             //             response.headers.get('content-type'),
//             //             'application/json'
//             //         );
//             //         const json = await response.json();
//             //         t.equals(json.greeting, 'Hello');
//             //         t.equals(json.subject, 'World');
//             //         await server.close();
//             //     }
//             // );
//             // await t.test(
//             //     'Static Hello World with env, context, and file template',
//             //     async t => {
//             //         const server = await serverRunner.run(
//             //             require.resolve(
//             //                 './hello-env-context-file-template.yml'
//             //             ),
//             //             {
//             //                 env: {
//             //                     recipient: 'planet'
//             //                 }
//             //             }
//             //         );
//             //         t.equals(server.crashed, false);
//             //         const response = await fetch(server.url);
//             //         t.equals(response.status, 200);
//             //         t.equals(
//             //             response.headers.get('content-type'),
//             //             'application/json'
//             //         );
//             //         const text = await response.text();
//             //         t.equals(text, 'Hi from a planet of external templates!!');
//             //         await server.close();
//             //     }
//             // );
//         };
//     }
// };
