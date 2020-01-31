if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
}
const {
    Utilities: { addImgOptMiddleware, loadEnvironment }
} = require('@magento/pwa-buildpack');
const { bestPractices, createUpwardServer } = require('@magento/upward-js');
const path = require('path');

async function serve() {
    const config = loadEnvironment(__dirname);

    if (config.error) {
        // loadEnvironment takes care of logging it
        process.exit(1);
    }

    const stagingServerSettings = config.section('stagingServer');

    process.chdir(path.join(__dirname, 'dist'));

    const upwardServerOptions = Object.assign(
        // defaults
        {
            bindLocal: true,
            logUrl: true
        },
        config.section('upwardJs'),
        stagingServerSettings, // overrides upward options
        {
            env: process.env,
            before(app) {
                addImgOptMiddleware(app, {
                    ...config.section('imageOptimizing'),
                    ...config.section('imageService')
                });
                app.use(bestPractices());
            }
        }
    );

    let envPort;
    if (process.env.PORT) {
        console.log(`PORT is set in environment: ${process.env.PORT}`);
        envPort = process.env.PORT;
    } else if (stagingServerSettings.port) {
        console.log(
            `STAGING_SERVER_PORT is configured: ${stagingServerSettings.port}`
        );
        envPort = stagingServerSettings.port;
    }

    if (config.isProd) {
        console.log(
            `NODE_ENV=production, will not attempt to use custom host or port`
        );

        if (envPort) {
            upwardServerOptions.port = envPort;
        } else {
            console.log(`No port set. Binding to random open port`);
            upwardServerOptions.port = 0;
        }
    } else {
        try {
            // don't require configureHost until you need to, since loading
            // the devcert library can have side effects.
            const {
                Utilities: { configureHost }
            } = require('@magento/pwa-buildpack');
            const { hostname, ports, ssl } = await configureHost(
                Object.assign(config.section('customOrigin'), {
                    dir: __dirname,
                    interactive: false
                })
            );
            upwardServerOptions.host = hostname;
            upwardServerOptions.https = ssl;
            upwardServerOptions.port = envPort || ports.staging || 0;
        } catch (e) {
            console.log(
                'Could not configure or access custom host. Using loopback...',
                e.message
            );
        }
    }
    console.log('Launching UPWARD server\n');
    await createUpwardServer(upwardServerOptions);
    console.log('\nUPWARD server running.');
}

serve().catch(e => {
    console.error(e.stack);
    process.exit(1);
});
