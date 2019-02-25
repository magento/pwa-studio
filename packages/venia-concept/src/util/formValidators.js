/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `null` when they pass.
 */

export const hasLengthAtLeast = (value, values, minimumLength) => {
    if (!value || value.length < minimumLength) {
        return `Must contain at least ${minimumLength} character(s).`;
    }
};

export const hasLengthAtMost = (value, values, maximumLength) => {
    if (value && value.length > maximumLength) {
        return `Must not exceed ${maximumLength} character(s).`;
    }
};

export const hasLengthExactly = (value, values, length) => {
    if (value && value.length !== length) {
        return `Must contain exactly ${length} character(s).`;
    }
};

export const isRequired = value => {
    return !(value || '').trim() ? 'The field is required.' : null;
};

export const validateEmail = value => {
    if (!value) {
        return null;
    }

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return !regex.test(value)
        ? 'Please enter a valid email address (Ex: johndoe@domain.com).'
        : null;
};

export const validateRegionCode = (value, values, countries) => {
    if (!value) {
        return null;
    }

    const country = countries.find(({ id }) => id === 'US');

    if (!country) {
        return 'Country "US" is not an available country.';
    }
    const { available_regions: regions } = country;

    if (!(Array.isArray(regions) && regions.length)) {
        return 'Country "US" does not contain any available regions.';
    }

    const region = regions.find(({ code }) => code === value);
    if (!region) {
        return `State "${value}" is not an valid state abbreviation.`;
    }

    return null;
};
