/**
 * Quick and dirty substitute for a proper schematized validator like `joi`.
 * TODO [good first issue]: Replace with a more standard object shape validator.
 */
const lget = require('lodash').get;
// A signal object for lodash.get to return, so we can check by reference
// whether a given property _exists_, rather than whether it is falsy.
const BLANK_DEFAULT = {};

class BuildpackValidationError extends Error {
    constructor(name, callsite, validationErrors) {
        super();

        const bullet = '\n\t- ';
        this.name = 'BuildpackValidationError';
        this.message =
            `${name}: Invalid configuration object. ` +
            `${callsite} was called with a configuration object that has the following problems:${bullet}` +
            validationErrors
                .map(
                    ([key, requiredType]) =>
                        `${key} must be of type ${requiredType}`
                )
                .join(bullet);
        this.validationErrors = validationErrors;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = (name, simpleSchema) => (callsite, options) => {
    const invalid = Object.entries(simpleSchema).reduce(
        (out, [key, requiredType]) => {
            const opt = lget(options, key, BLANK_DEFAULT);
            if (opt === BLANK_DEFAULT || typeof opt !== requiredType) {
                out.push([key, requiredType]);
            }
            return out;
        },
        []
    );
    if (invalid.length > 0) {
        throw new BuildpackValidationError(name, callsite, invalid);
    }
};
