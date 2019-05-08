module.exports.command = 'load-env <directory>';

module.exports.describe =
    'Load and validate the current environment, including .env file if present, to ensure all required configuration is in place.';

module.exports.handler = function buildpackCli({ directory }) {
    const { error } = require('../Utilities/loadEnvironment')(directory);
    if (error) {
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};
