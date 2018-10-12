process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.NODE_ENV = 'production';
require('dotenv').config();
const {
    Utilities: { configureHost }
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
        const { hostname, ports, ssl } = await configureHost({
            subdomain: process.env.MAGENTO_BUILDPACK_SECURE_HOST_SUBDOMAIN,
            exactDomain: process.env.MAGENTO_BUILDPACK_SECURE_HOST_EXACT_DOMAIN,
            addUniqueHash: !!process.env
                .MAGENTO_BUILDPACK_SECURE_HOST_ADD_UNIQUE_HASH
        });
        config.host = hostname;
        config.https = ssl;
        config.port = ports.staging;
    }

    await createUpwardServer(config);
    console.log('\nStaging server running at the address above.\n');
}

console.log('Launching staging server...\n');
serve();
