const { resolve } = require('path');
const prettyLogger = require('../util/pretty-logger');
const loadEnvironment = require('../Utilities/loadEnvironment');
const configureHost = require('../Utilities/configureHost');
module.exports.command = 'create-custom-origin <directory>';

module.exports.describe =
    'Get or create a secure, unique hostname/port combination and a trusted SSL certificate for local development, which enables all PWA features.';

module.exports.handler = async function buildpackCli({ directory }) {
    const projectRoot = resolve(directory);
    try {
        const projectConfig = loadEnvironment(projectRoot);
        if (projectConfig.error) {
            // eslint-disable-next-line no-process-exit
            return process.exit(1);
        }
        const config = projectConfig.section('customOrigin');
        if (!config.enabled) {
            prettyLogger.error(
                'Custom origins in this project are disabled because the environment variable `CUSTOM_ORIGIN_ENABLED` is not set to 1.'
            );
            prettyLogger.error(
                `To create and/or use a custom origin, set that variable to 1 in the "${resolve(
                    directory,
                    '.env'
                )}" file, or otherwise in the environment.`
            );
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }
        const { hostname, ports } = await configureHost(projectRoot, {
            ...config,
            interactive: true
        });
        prettyLogger.info(
            `Acquired custom hostname and SSL cert for ${hostname}. Development server will run on port ${
                ports.development
            } and staging server will run on port ${ports.staging}.`
        );
    } catch (e) {
        prettyLogger.error(e.message);
        // eslint-disable-next-line no-process-exit
        process.exit(2);
    }
};
