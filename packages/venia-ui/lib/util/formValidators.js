/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `undefined` when they pass.
 */

const SUCCESS = undefined;

export const hasLengthAtLeast = (value, values, minimumLength) => {
    const message = {
        id: 'validation.hasLengthAtLeast',
        defaultMessage: 'Must contain more characters',
        value: minimumLength
    };
    if (!value || value.length < minimumLength) {
        return message;
    }

    return SUCCESS;
};

export const hasLengthAtMost = (value, values, maximumLength) => {
    if (value && value.length > maximumLength) {
        const message = {
            id: 'validation.hasLengthAtMost',
            defaultMessage: 'Must have less characters',
            value: maximumLength
        };
        return message;
    }

    return SUCCESS;
};

export const hasLengthExactly = (value, values, length) => {
    if (value && value.length !== length) {
        const message = {
            id: 'validation.hasLengthExactly',
            defaultMessage: 'Does not have exact number of characters',
            value: length
        };
        return message;
    }

    return SUCCESS;
};

/**
 * isRequired is provided here for convenience but it is inherently ambiguous and therefore we don't recommend using it.
 * Consider using more specific validators such as `hasLengthAtLeast` or `mustBeChecked`.
 */
export const isRequired = value => {
    const FAILURE = {
        id: 'validation.isRequired',
        defaultMessage: 'Is required.'
    };

    // The field must have a value (no null or undefined) and
    // if it's a boolean, it must be `true`.
    if (!value) return FAILURE;

    // If it is a number or string, it must have at least one character of input (after trim).
    const stringValue = String(value).trim();
    const measureResult = hasLengthAtLeast(stringValue, null, 1);

    if (measureResult) return FAILURE;
    return SUCCESS;
};

export const mustBeChecked = value => {
    const message = {
        id: 'validation.mustBeChecked',
        defaultMessage: 'Must be checked.'
    };
    if (!value) return message;

    return SUCCESS;
};

export const validateRegionCode = (value, values, countries) => {
    const countryCode = DEFAULT_COUNTRY_CODE;
    const country = countries.find(({ id }) => id === countryCode);

    if (!country) {
        const invalidCountry = {
            id: 'validation.invalidCountry',
            defaultMessage: `Country "${countryCode}" is not an available country.`,
            value: countryCode
        };
        return invalidCountry;
    }
    const { available_regions: regions } = country;

    if (!(Array.isArray(regions) && regions.length)) {
        const invalidRegions = {
            id: 'validation.invalidRegions',
            defaultMessage: `Country "${countryCode}" does not contain any available regions.`,
            value: countryCode
        };
        return invalidRegions;
    }

    const region = regions.find(({ code }) => code === value);
    if (!region) {
        const invalidAbbrev = {
            id: 'validation.invalidAbbreviation',
            defaultMessage: 'That is not a valid state abbreviation.',
            value: value
        };
        return invalidAbbrev;
    }

    return SUCCESS;
};

export const validatePassword = value => {
    const count = {
        lower: 0,
        upper: 0,
        digit: 0,
        special: 0
    };

    for (const char of value) {
        if (/[a-z]/.test(char)) count.lower++;
        else if (/[A-Z]/.test(char)) count.upper++;
        else if (/\d/.test(char)) count.digit++;
        else if (/\S/.test(char)) count.special++;
    }

    if (Object.values(count).filter(Boolean).length < 3) {
        const message = {
            id: 'validation.validatePassword',
            defaultMessage:
                'A password must contain at least 3 of the following: lowercase, uppercase, digits, special characters.'
        };
        return message;
    }

    return SUCCESS;
};

export const isEqualToField = (value, values, fieldKey) => {
    const message = {
        id: 'validation.isEqualToField',
        defaultMessage: 'Fields must match',
        value: fieldKey
    };
    return value === values[fieldKey] ? SUCCESS : message;
};

export const isNotEqualToField = (value, values, fieldKey) => {
    const message = {
        id: 'validation.isNotEqualToField',
        defaultMessage: 'Fields must be different',
        value: fieldKey
    };
    return value !== values[fieldKey] ? SUCCESS : message;
};
