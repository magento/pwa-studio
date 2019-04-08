const { writeFileSync } = require('fs');
const { resolve } = require('path');
const prettyLogger = require('../util/pretty-logger');
module.exports.command = 'create-env-file <directory>';

module.exports.describe =
    'Generate a .env file in the provided directory to store project configuration as environment variables';

module.exports.handler = function buildpackCli({ directory }) {
    const envFilePath = resolve(directory, '.env');
    writeFileSync(
        envFilePath,
        require('../Utilities/createDotEnvFile')(),
        'utf8'
    );
    prettyLogger.info(
        `Successfully wrote a fresh configuration file to ${envFilePath}`
    );
};
