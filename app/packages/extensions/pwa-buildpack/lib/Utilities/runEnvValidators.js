/**
 * @module Buildpack/Utilities
 */
const debug = require('debug')('pwa-buildpack:runEnvValidators');

/**
 * Validate the project ENV.
 * Calling this function will invoke the `validateEnv` target of buildpack. All the intercepts
 * will be provided the whole process.ENV, a callback function to call if the validation has failed
 * and a debug function to be used in case of the debug mode.
 *
 * @public
 * @memberof Buildpack/Utilities
 * @param {string} context Project root directory.
 * @param {object} env Project ENV.
 * @returns {Boolean}
 */
async function validateEnv(context, env) {
    debug('Running ENV Validations');

    const BuildBus = require('../BuildBus');

    if (process.env.DEBUG && process.env.DEBUG.includes('BuildBus')) {
        BuildBus.enableTracking();
    }

    const bus = BuildBus.for(context);
    bus.init();

    const errorMessages = [];
    const onFail = errorMessage => errorMessages.push(errorMessage);

    const validationContext = { env, onFail, debug };

    try {
        await bus
            .getTargetsOf('@magento/pwa-buildpack')
            .validateEnv.promise(validationContext);
    } catch {
        /**
         * While creating a new project using the create-pwa cli
         * runEnvValidators will be invoked but the buildpack targets
         * will be missing, and it is expected. Hence we are wrapping
         * it in a try catch to avoid build failures. Anyways we wont be
         * using env validations while creating project. It will be useful
         * while building a project.
         */
        debug('Buildpack targets not found.');
    }

    if (errorMessages.length) {
        debug('Found validation errors in ENV, stopping the build process');

        const removeErrorPrefix = msg => msg.replace(/^Error:\s*/, '');
        const printValidationMsg = (error, index) =>
            `\n (${index + 1}) ${removeErrorPrefix(error.message || error)}`;
        const prettyErrorList = errorMessages.map(printValidationMsg);
        const validationError = new Error(
            `Environment has ${
                errorMessages.length
            } validation errors: ${prettyErrorList}`
        );
        validationError.errorMessages = errorMessages;

        throw validationError;
    }

    debug('No issues found in the ENV');

    return true;
}

module.exports = validateEnv;
