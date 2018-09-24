/**
 * Quick and dirty substitute for a proper schematized validator like `joi`.
 * TODO [good first issue]: Replace with a more standard object shape validator.
 */
const lget = require('lodash').get;
const type = require('type-detect');
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

// indicate arrays of primitive types with such as `string[]` or `boolean[]`.
const arrayTypeTag = /\[\]$/;

module.exports = (name, simpleSchema) => {
    // create a validator object with methods named after schema keys, returning
    // true or false. example: a schema { foo: "string" } would produce a
    // validator object somewhat like { foo: x => typeof x === 'string' }.
    // when validation is called for [key, value], check if a validator exists
    // on this object, i.e. `validators[key]`, and then run it against the
    // value, i.e. `validators[key](value);
    const validators = Object.entries(simpleSchema).reduce(
        (out, [key, typeTag]) => {
            const isArrayType = arrayTypeTag.test(typeTag);
            const scalarType = typeTag.replace(arrayTypeTag, '');

            // a typeof test is cheap, but the more sophisticated `type-detect`
            // allows for types like 'array' and 'regexp'.
            const isRequiredType = value =>
                typeof value === scalarType ||
                type(value).toLowerCase() === scalarType;

            // if primitive array type, e.g. `string[]`, then test each member
            // of the array; otherwise, just test the value itself.
            out[key] = isArrayType
                ? value => Array.isArray(value) && value.every(isRequiredType)
                : isRequiredType;

            return out;
        },
        {}
    );
    return (callsite, options) => {
        // use a reduce to map and filter at the same time.
        // only add invalid props to this `invalid` object, but also, turn them
        // into key-value pairs.
        const invalid = Object.keys(options)
            .filter(key => validators[key])
            .reduce((out, key) => {
                const opt = lget(options, key, BLANK_DEFAULT);
                const missing = opt === BLANK_DEFAULT;
                if (missing || !validators[key](opt)) {
                    out.push([key, simpleSchema[key]]);
                }
                return out;
            }, []);
        if (invalid.length > 0) {
            throw new BuildpackValidationError(name, callsite, invalid);
        }
    };
};
