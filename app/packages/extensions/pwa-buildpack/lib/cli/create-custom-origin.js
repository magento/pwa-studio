const { resolve } = require('path');
const prettyLogger = require('../util/pretty-logger');
const loadEnvironment = require('../Utilities/loadEnvironment');
const configureHost = require('../Utilities/configureHost');

// signal to the outer CLI manager that it can quietly exit 1 instead of
// printing a large stack trace
const failExpected = msg => {
    const e = new Error(msg);
    e.expected = true;
    throw e;
};

module.exports.command = 'create-custom-origin <directory>';

module.exports.describe =
    'Get or create a secure, unique hostname/port combination and a trusted SSL certificate for local development, which enables all PWA features.';

module.exports.handler = async function buildpackCli({ directory }) {
    const projectRoot = resolve(directory);
    try {
        const projectConfig = await loadEnvironment(projectRoot, prettyLogger);
        if (projectConfig.error) {
            failExpected(projectConfig.error);
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
            failExpected('custom origin disabled');
        }
        const { hostname, ports } = await configureHost({
            ...config,
            dir: projectRoot,
            interactive: true
        });
        prettyLogger.info(
            `Acquired custom hostname and SSL cert for ${hostname}. Development server will run on port ${
                ports.development
            } and staging server will run on port ${ports.staging}.`
        );
    } catch (e) {
        prettyLogger.error(e.message);
        failExpected(e.message);
    }
};
