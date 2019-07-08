process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
}
const {
    Utilities: { addImgOptMiddleware, loadEnvironment }
} = require('@magento/pwa-buildpack');
const { bestPractices, createUpwardServer } = require('@magento/upward-js');

async function serve() {
    const config = loadEnvironment(__dirname);

    const upwardServerOptions = Object.assign(
        // defaults
        {
            bindLocal: true,
            logUrl: true
        },
        config.section('upwardJs'),
        config.section('stagingServer'), // overrides upward options
        {
            env: process.env,
            before(app) {
                addImgOptMiddleware(
                    app,
                    Object.assign(
                        config.section('magento'),
                        config.section('imageService')
                    )
                );
                app.use(bestPractices());
            }
        }
    );

    if (config.isProd) {
        console.log(`NODE_ENV=production, will not attempt to use custom host`);
        if (upwardServerOptions.port) {
            console.log(
                `options.port is configured: ${upwardServerOptions.port}`
            );
        } else if (process.env.PORT) {
            console.log(`PORT is set in environment: ${process.env.PORT}`);
            upwardServerOptions.port = process.env.PORT;
        } else {
            console.log(`No port set. Binding to random open port`);
            upwardServerOptions.port = 0;
        }
    } else if (!upwardServerOptions.host) {
        try {
            // don't require configureHost until you need to, since loading
            // the devcert library can have side effects.
            const {
                Utilities: { configureHost }
            } = require('@magento/pwa-buildpack');
            const { hostname, ports, ssl } = await configureHost(
                Object.assign(config.section('customOrigin'), {
                    interactive: false
                })
            );
            upwardServerOptions.host = hostname;
            upwardServerOptions.https = ssl;
            upwardServerOptions.port = ports.staging;
        } catch (e) {
            console.log(
                'Could not configure or access custom host. Using loopback...'
            );
        }
    }

    console.log('Launching UPWARD server\n');
    await createUpwardServer(upwardServerOptions);
    console.log('\nUPWARD server running.');
}

serve();
