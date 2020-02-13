/**
 * Converts a set of values to a range filter
 * @param {Set} values
 */
const toRangeFilter = values => {
    // TODO: Validation.
    // Range should always only be a single string. In the event we received
    // multiple, just return the first.
    const rangeString = Array.from(values)[0];

    const [from, to] = rangeString.split('_');
    const rangeFilter = {
        from,
        to
    };

    if (rangeFilter.from === '*') {
        delete rangeFilter.from;
    }
    if (rangeFilter.to === '*') {
        delete rangeFilter.to;
    }
    return rangeFilter;
};

/**
 * Converts a set of values into an equals filter
 * @param {Set} values
 */
const toEqualFilter = values => {
    // TODO: Validation.

    if (values.size > 1) {
        return {
            in: Array.from(values)
        };
    } else {
        return {
            eq: Array.from(values)[0]
        };
    }
};

/**
 * Converts a set of values into a match filter
 * @param {Set} values
 */
const toMatchFilter = values => {
    return { match: Array.from(values)[0] };
};

const CONVERSION_FUNCTIONS = {
    FilterEqualTypeInput: toEqualFilter,
    FilterMatchTypeInput: toMatchFilter,
    FilterRangeTypeInput: toRangeFilter
};

/**
 * Returns a filter input object matching the type provided.
 *
 * @param values - A set of values to construct the result object from.
 * @param type - Any of the possible types of filter input types
 */
export const getFilterInput = (values, type) => {
    const conversionFunction = CONVERSION_FUNCTIONS[type];
    if (!conversionFunction) {
        throw TypeError('Unknown type', type);
    }
    return conversionFunction(values);
};
