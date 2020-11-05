const isNotWorking = async env => {
    return false;
};

const seriousSecurityProblemInEnv = () => false;

const fetchBackends = async () => {
    return Promise.resolve(['backend 1', 'backend 2']);
};

const validateSampleBackend = async ({ env, fail }) => {
    // to stop all other validation, throw an exception
    if (seriousSecurityProblemInEnv(env)) {
        throw new Error(
            'Not even gonna let this continue because there is evidence of some untrustworthy other extension installed'
        );
    }

    if (await isNotWorking(env)) {
        // fetch the backends
        const otherbackends = await fetchBackends();
        // register a validation problem, or mltiple ones, by calling fail() one or more times
        // call with a string, or optionally with an Error object to get a stack trace
        fail(new Error(`Error: ${JSON.stringify(otherbackends)}`));
    }
};

module.exports = targets => {
    targets
        .of('@magento/pwa-buildpack')
        .validateEnv.tapPromise(validateSampleBackend);
};
