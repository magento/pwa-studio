const { resolve } = require('path');
const prettyLogger = require('../util/pretty-logger');
const configureEnvironment = require('../Utilities/configureEnvironment');
const configureHost = require('../Utilities/configureHost');
module.exports.command = 'init-custom-origin <directory>';

module.exports.describe =
    'Get or create a secure, unique hostname/port combination and a trusted SSL certificate for local development.';

module.exports.handler = async function buildpackCli({ directory }) {
    const projectRoot = resolve(directory);
    const workDir = process.cwd();
    if (workDir !== projectRoot) {
        process.chdir(projectRoot);
    }
    try {
        const projectEnv = configureEnvironment(projectRoot);
        const { hostname, ports } = await configureHost({
            ...projectEnv,
            interactive: true
        });
        prettyLogger.info(
            `Acquired custom hostname and SSL cert for ${hostname}. Development server will run on port ${
                ports.development
            } and staging server will run on port ${ports.staging}.`
        );
    } finally {
        if (workDir !== projectRoot) {
            process.chdir(projectRoot);
        }
    }
};
