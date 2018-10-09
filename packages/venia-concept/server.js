process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
require('dotenv').config();
const {
    Utilities: { setupDomain }
} = require('@magento/pwa-buildpack');
const { createUpwardServer, envToConfig } = require('@magento/upward-js');

async function serve() {
    const config = Object.assign(
        {
            bindLocal: true,
            logUrl: true
        },
        envToConfig()
    );

    if (!config.host) {
        const { ready, setLoopbacks, makeCerts } = await setupDomain(
            'magento-venia',
            {
                dryRun: true,
                unique: false
            }
        );
        if (!ready) {
            if (setLoopbacks.length > 0) {
                console.warn('No custom host provided.');
            }
            if (makeCerts.length > 0) {
                console.warn('No SSL certificate provided.');
            }
        } else {
            const { hostname, certPair } = await setupDomain('magento-venia', {
                unique: false
            });
            config.host = hostname;
            config.https = certPair;
        }
    }

    await createUpwardServer(config);
    console.log('\nStaging server running at the address above.\n');
}

console.log('Launching staging server...\n');
serve();
