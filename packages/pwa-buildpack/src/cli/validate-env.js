module.exports.command = 'validate-env <directory>';

module.exports.describe =
    'Check the current environment, including .env file if present, to ensure all required values are present.';

module.exports.handler = function buildpackCli({ directory }) {
    const { error } = require('../Utilities/configureEnvironment')(directory);
    if (error) {
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};
