const https = require('https');
const fetch = require('node-fetch');
const agent = new https.Agent({
    rejectUnauthorized: false
});

const fetchWithAgent = async url => {
    return await fetch(url, { agent });
};

const isBackendActive = async (magentoBackend, debug) => {
    try {
        const res = await fetchWithAgent(magentoBackend);

        return res.ok;
    } catch (err) {
        debug(err);

        return false;
    }
};

const fetchBackends = async debug => {
    try {
        const res = await fetch(
            'https://fvp0esmt8f.execute-api.us-east-1.amazonaws.com/default/getSampleBackends'
        );
        const { sampleBackends } = await res.json();

        return sampleBackends.environments;
    } catch (err) {
        debug(err);

        return [];
    }
};

/**
 * Validation function to check if the backend being used is one of the sample backends provided
 * by PWA Studio. If yes, the function validates if the backend is active. If not, it reports an
 * error by calling the onFail function. In the error being reported, it sends the other sample
 * backends that the developers can use.
 *
 * @param {Object} config.env - The ENV provided to the app, usually avaialable through process.ENV
 * @param {Function} config.onFail - callback function to call on validation fail
 * @param {Function} config.debug - function to log debug messages in console in debug mode
 *
 * To watch the debug messages, run the command with DEBUG=*runEnvValidators*
 */
const validateSampleBackend = async config => {
    console.warn(
        '\n venia-sample-backends is a "development-only" extension, please remove it from your project\'s package.json before going to production.\n'
    );

    const { env, onFail, debug } = config;

    const backendIsActive = await isBackendActive(
        env.MAGENTO_BACKEND_URL,
        debug
    );

    if (!backendIsActive) {
        debug(`${env.MAGENTO_BACKEND_URL} is inactive`);

        debug('Fetching other backends');

        const sampleBackends = await fetchBackends(debug);
        const otherBackends = sampleBackends.filter(
            ({ url }) => url !== env.MAGENTO_BACKEND_URL
        );

        debug('PWA Studio supports the following backends', sampleBackends);

        debug('Reporting backend URL validation failure');
        if (otherBackends.length) {
            onFail(
                `${
                    env.MAGENTO_BACKEND_URL
                } is inactive. Please consider using one of these other backends: \n\n ${JSON.stringify(
                    otherBackends
                )} \n`
            );
        } else {
            onFail(
                `${
                    env.MAGENTO_BACKEND_URL
                } is inactive. Please consider using an active backend \n`
            );
        }
    } else {
        debug(`${env.MAGENTO_BACKEND_URL} is active`);
    }
};

module.exports = targets => {
    targets
        .of('@magento/pwa-buildpack')
        .validateEnv.tapPromise(validateSampleBackend);
};

module.exports.validateSampleBackend = validateSampleBackend;
