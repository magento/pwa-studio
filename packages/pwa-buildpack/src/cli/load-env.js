const path = require('path');
const execa = require('execa');
const prettyLogger = require('../util/pretty-logger');
module.exports.command = 'load-env <directory>';

module.exports.describe =
    'Load and validate the current environment, including .env file if present, to ensure all required configuration is in place.';

module.exports.builder = {
    createIfAbsent: {
        type: 'boolean',
        desc:
            'If no .env file exists in the directory, then create one (with `buildpack create-env-file`)'
    },
    useExamples: {
        type: 'boolean',
        desc:
            'If --create-if-absent is set, pass the --use-examples flag to `buildpack create-env-file` to prepopulate the .env file with examples. If --create-if-absent is unset, this option has no effect.'
    }
};

function inPWAStudioRepo() {
    try {
        const gitRoot = execa.shellSync('git rev-parse --show-toplevel').stdout;
        if (gitRoot) {
            const { name } = require(path.resolve(gitRoot, 'package.json'));
            if (name === '@magento/pwa-studio') {
                return true;
            }
        }
    } catch (e) {}
    return false;
}

module.exports.handler = function buildpackCli({
    directory,
    createIfAbsent,
    useExamples
}) {
    const { error, envFilePresent } = require('../Utilities/loadEnvironment')(
        directory
    );
    if (!envFilePresent) {
        prettyLogger.warn(`No .env file found in ${directory}`);
        if (createIfAbsent) {
            prettyLogger.warn(
                `Creating new .env file using ${
                    useExamples ? 'example' : 'default'
                } values`
            );
            require('./create-env-file').handler({ directory, useExamples });
            return;
        } else {
            if (inPWAStudioRepo()) {
                prettyLogger.warn(
                    `No .env file in packages/venia-concept.\n\tAutogenerate a .env file in your Venia project by running the command 'yarn workspace @magento/venia-concept create-dev-env'
                    in the repo root.`
                );
            } else {
                prettyLogger.warn(
                    `No .env file in ${directory}. Autogenerate a .env file by running the command 'npx @magento/pwa-buildpack create-env.file .' in ${directory}.`
                );
            }
        }
    }
    if (error) {
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};
