const fetch = require('node-fetch');

const isBackendActive = async env => {
    try {
        const magentoBackend = env.MAGENTO_BACKEND_URL;
        const res = await fetch(magentoBackend);

        return res.ok;
    } catch (err) {
        console.error(err);

        return false;
    }
};

const fetchBackends = async () => {
    try {
        const res = await fetch(
            'https://fvp0esmt8f.execute-api.us-east-1.amazonaws.com/default/getSampleBackends'
        );
        const { sampleBackends } = await res.json();

        return sampleBackends.environments;
    } catch (err) {
        console.error(err);

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
    const { env, onFail, debug } = config;

    const backendIsActive = await isBackendActive(env);

    if (!backendIsActive) {
        debug(`${env.MAGENTO_BACKEND_URL} is inactive`);

        debug('Fetching other backends');

        const sampleBackends = await fetchBackends();
        const otherBackends = sampleBackends.filter(
            backend => backend !== env.MAGENTO_BACKEND_URL
        );

        debug(
            'PWA Studio supports the following backends',
            sampleBackends.join('\n')
        );

        debug('Reporting backend URL validation failure');
        onFail(
            `${
                env.MAGENTO_BACKEND_URL
            } is inactive. Please consider using one of these other backends: \n\n ${JSON.stringify(
                otherBackends
            )} \n`
        );
    } else {
        debug(`${env.MAGENTO_BACKEND_URL} is active`);
    }
};

module.exports = targets => {
    targets
        .of('@magento/pwa-buildpack')
        .validateEnv.tapPromise(validateSampleBackend);
};
