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

module.exports.handler = function buildpackCli({ directory, coreDevMode }) {
    const { error, envFilePresent } = require('../Utilities/loadEnvironment')(
        directory
    );
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
                `No .env file in ${directory}. Autogenerate a .env file by running the command 'npx @magento/pwa-buildpack create-env.file .' in ${directory}.`
            );
        }
    }
    if (error) {
        // signal to the outer CLI manager that it can quietly exit 1 instead of
        // printing a large stack trace
        const handledError = new Error(error);
        handledError.expected = true;
        throw handledError;
    }
};
