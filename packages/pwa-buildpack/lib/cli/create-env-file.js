const { writeFileSync } = require('fs');
const { resolve } = require('path');

const createDotEnvFile = require('../Utilities/createDotEnvFile');
const prettyLogger = require('../util/pretty-logger');
module.exports.command = 'create-env-file <directory>';

module.exports.describe =
    'Generate a .env file in the provided directory to store project configuration as environment variables';

module.exports.builder = {
    useExamples: {
        type: 'bool',
        desc: 'Auto-populate the .env file with example values'
    }
};

module.exports.handler = async function buildpackCli({
    directory,
    useExamples
}) {
    const envFilePath = resolve(directory, '.env');
    const dotEnvFile = await createDotEnvFile(directory, {
        useExamples
    });
    writeFileSync(envFilePath, dotEnvFile, 'utf8');
    prettyLogger.info(
        `Successfully wrote a fresh configuration file to ${envFilePath}`
    );
};
