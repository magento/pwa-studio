/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `null` when they pass.
 */

export const hasLengthAtLeast = (value, minimumLength) => {
    if (!value || value.length < minimumLength) {
        return `Must contain at least ${minimumLength} character(s).`;
    }
};

export const hasLengthAtMost = (value, maximumLength) => {
    if (value && value.length > maximumLength) {
        return `Must not exceed ${maximumLength} character(s).`;
    }
};

export const hasLengthExactly = (value, length) => {
    if (value && value.length !== length) {
        return `Must contain exactly ${length} character(s).`;
    }
};

export const isNotEmpty = value => hasLengthAtLeast(value, 1);
