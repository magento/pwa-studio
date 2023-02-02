const prettyLogger = require('../util/pretty-logger');
module.exports.command = 'load-env <directory>';

module.exports.describe =
    'Load and validate the current environment, including .env file if present, to ensure all required configuration is in place.';

module.exports.builder = {
    coreDevMode: {
        type: 'boolean',
        desc:
            'For core @magento/pwa-studio repository development. Creates a .env file populated with examples if one is not present.'
    }
};

module.exports.handler = async function buildpackCli(
    { directory, coreDevMode },
    proc = process
) {
    const {
        error,
        envFilePresent
    } = await require('../Utilities/loadEnvironment')(directory);
    if (!envFilePresent) {
        if (coreDevMode) {
            prettyLogger.warn(`Creating new .env file using example values`);
            require('./create-env-file').handler({
                directory,
                useExamples: true
            });
            return;
        } else {
            prettyLogger.warn(
                `No .env file in ${directory}. Autogenerate a .env file by running the command 'buildpack create-env-file ${directory}'.`
            );
        }
    }
    if (error) {
        // yargs doesn't propagate async errors to its global fail command
        // so we inject process for testability and call exit on it directly
        // https://github.com/yargs/yargs/issues/1102
        // eslint-disable-next-line no-process-exit
        proc.exit(1);
    }
};
