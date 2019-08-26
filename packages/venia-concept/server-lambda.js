const path = require('path');
process.chdir(path.resolve(__dirname, 'dist'));
const { bestPractices, createUpwardServer } = require('@magento/upward-js');

const loadEnvironment = require('@magento/pwa-buildpack/lib/Utilities/loadEnvironment');

async function serve() {
    const config = loadEnvironment(__dirname);
    const upwardServerOptions = Object.assign(
        {},
        config.section('upwardJs'),
        config.section('stagingServer'),
        {
            env: process.env,
            before: app => {
                app.use(bestPractices());
            }
        }
    );

    const server = await createUpwardServer(upwardServerOptions);
    return server;
}

console.log('[VENIA] Launching staging server...\n');
const appStarted = serve();

// This part is for now.sh version 2 and other serverless deployments.
// A lambda probably won't execute against more than one request, but juuuuust
// in case it does, let's cache the server startup procedure.
let server;
let calls = 0;

module.exports = async (req, res) => {
    if (!server) {
        console.log('[VENIA] Awaiting staging server...');
        server = await appStarted;
    } else {
        console.log(
            `[VENIA] Reusing existing staging server (this lambda handled ${++calls} calls)`
        );
    }
    server.app(req, res);
};
