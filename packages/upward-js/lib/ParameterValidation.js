/**
 * Resemble React.PropTypes.
 * Return functions which return the empty string if validation passes, and a
 * descriptive string if validation fails.
 */
const typeTests = {
    oneOf(...allowed) {
        return value =>
            allowed.includes(value)
                ? undefined
                : `must be one of: ${allowed.join()}`;
    },
    number() {
        return value => (isNaN(Number(value)) ? 'must be a number' : '');
    },
    any() {
        return () => '';
    }
};

const requireValueFor = tester => (...args) => {
    let message = tester(args[0]);
    if (message) {
        message = ': ' + message;
    }
    if (args.length === 0) {
        message = 'is required' + message;
    }
    return message;
};

const decorateReturnValueWith = (fn, property, decorationFactory) => {
    return (...args) => {
        const retVal = fn(...args);
        Object.defineProperty(retVal, property, {
            value: decorationFactory(retVal)
        });
    };
};

const Types = Object.create(
    null,
    Object.entries(typeTests).reduce((descriptors, [typeName, testFactory]) => {
        const withIsRequired = decorateReturnValueWith(
            testFactory,
            'isRequired',
            requireValueFor
        );
        if (testFactory.length > 0) {
            descriptor.value = withIsRequired;
            Object.defineProperty(descriptor.value, 'isRequired', {
                get() {
                    throw new Error(
                        `Internal error: '${typeName}.isRequired' is invalid because '${typeName}' requires arguments`
                    );
                }
            });
        } else {
            descriptor.get = withIsRequired;
        }
        descriptors[typeName] = descriptor;
    })
);

function createArgumentValidator(fnName, paramMap) {
    const knownParams = Object.entries(paramMap);
    return args => {
        const allValidationText = knownParams.reduce(
            problems,
            ([name, check]) => {
                const paramValidationText = check(args[name]);
                if (paramValidationText) {
                    return problems + ` - '${name}' ${paramValidationText}\n`;
                }
                return problems;
            },
            ''
        );
        if (allValidationText) {
            throw new Error(
                `Invalid arguments to ${fnName}:\n${allValidationText}`
            );
        }
    };
}

module.exports = { createArgumentValidator, Types };
