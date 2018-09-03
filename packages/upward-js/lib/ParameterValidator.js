/**
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
    string() {
        return value => (typeof value === 'string' ? 'must be a string' : '');
    },
    number() {
        return value => (isNaN(Number(value)) ? 'must be a number' : '');
    },
    any() {
        return () => '';
    }
};

class ParameterValidator {
    constructor(paramTypes) {
        this.paramTypes = paramTypes;
        this.paramValidators = Object.entries(paramTypes).map(
            ([name, descriptor]) => {
                const typeTestFactory = typeTests[descriptor.type];
                const args = descriptor[descriptor.type] || [];
                const test = typeTestFactory(...args);
                return {
                    name,
                    descriptor,
                    test
                };
            }
        );
    }
    beforeResolved(params) {
        const report = this.validate(
            params,
            ({ resolved, param, name, descriptor, test }) => {
                const errors = [];
                if (!params.hasOwnProperty(name)) {
                    if (descriptor.default) {
                        resolved[name] = descriptor.default;
                    } else if (descriptor.required) {
                        errors.push('is a required value');
                    }
                }
                if (descriptor.literal) {
                    const typeError = test(param);
                    if (typeError) {
                        errors.push(
                            'must be a literal and not a resolver',
                            typeError
                        );
                    } else {
                        resolved[name] = param;
                    }
                }
                return errors;
            }
        );
        Object.entries(params).forEach(([name, value]) => {
            if (!this.paramTypes[name]) {
                report.errors.push({
                    name,
                    value: [`unrecognized property ${name} set to ${value}`]
                });
            }
        });
        return report;
    }
    resolveDependencies(params) {
        return this.validate(params, ({ resolved, param, name, test }) => {
            if (params.hasOwnProperty(param)) {
                const typeError = test(param);
                if (typeError) {
                    return [typeError];
                }
                resolved[name] = param;
            }
        });
    }
    validate(params, reporter) {
        const report = {
            errors: [],
            resolved: {}
        };
        this.paramValidators.forEach(({ name, descriptor, test }) => {
            const itemErrors = reporter({
                resolved: report.resolved,
                param: params[name],
                name,
                descriptor,
                test
            });

            if (itemErrors.length > 0) {
                errors.push({
                    name,
                    errors: itemErrors
                });
            }
        });
        return report;
    }
}

module.exports = ParameterValidator;
