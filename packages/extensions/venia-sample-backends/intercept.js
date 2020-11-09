const fetch = require('node-fetch');

const isAValidBackend = async env => {
    const magentoBackend = env.MAGENTO_BACKEND_URL;
    const res = await fetch(magentoBackend);

    return res.ok;
};

const fetchBackends = async () => {
    const res = await fetch(
        'https://fvp0esmt8f.execute-api.us-east-1.amazonaws.com/default/getSampleBackends'
    );
    const { sampleBackends } = await res.json();

    return sampleBackends.environments;
};

/**
 * Validation function to check if the backend being used is one of the sample backends provided
 * by PWA Studio. If yes, the function validates if the backend is active. If not, it reports an
 * error by calling the onFail function. In the error being reported, it sends the other sample
 * backends that the developers can use.
 *
 * @param {Object} config.env - The ENV provided to the app, usually avaialable through process.ENV
 * @param {Function} config.onFail - callback function to call on validation fail
 */
const validateSampleBackend = async config => {
    const { env, onFail } = config;

    const backendIsActive = await isAValidBackend(env);

    if (!backendIsActive) {
        const sampleBackends = await fetchBackends();
        const otherBackends = sampleBackends.filter(
            backend => backend !== env.MAGENTO_BACKEND_URL
        );

        onFail(
            new Error(
                `${
                    env.MAGENTO_BACKEND_URL
                } is inactive. Please consider using one of these other backends: ${JSON.stringify(
                    otherBackends
                )}`
            )
        );
    }
};

module.exports = targets => {
    targets
        .of('@magento/pwa-buildpack')
        .validateEnv.tapPromise(validateSampleBackend);
};
