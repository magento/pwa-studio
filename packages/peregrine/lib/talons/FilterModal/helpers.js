export const DELIMITER = ',';
export const getSearchFromState = (initialValue, filterKeys, filterState) => {
    // preserve all existing params
    const nextParams = new URLSearchParams(initialValue);

    // iterate over available filters
    for (const key of filterKeys) {
        // remove any existing filter values
        nextParams.delete(key);
    }

    // iterate over the latest filter values
    for (const [group, items] of filterState) {
        for (const item of items) {
            const { title, value } = item || {};

            // append the new values
            nextParams.append(
                `${group}[filter]`,
                `${title}${DELIMITER}${value}`
            );
        }
    }

    // prepend `?` to the final string
    return `?${nextParams.toString()}`;
};

export const getStateFromSearch = (initialValue, filterKeys, filterItems) => {
    // preserve all existing params
    const params = new URLSearchParams(initialValue);
    const uniqueKeys = new Set(params.keys());
    const nextState = new Map();

    // iterate over existing param keys
    for (const key of uniqueKeys) {
        // if a key matches a known filter, add its items to the next state
        if (filterKeys.has(key) && key.endsWith('[filter]')) {
            // derive the group by slicing off `[filter]`
            const group = key.slice(0, -8);
            const items = new Set();
            const groupItemsByValue = new Map();

            // cache items by value to avoid inefficient lookups
            for (const item of filterItems.get(group)) {
                groupItemsByValue.set(item.value, item);
            }

            // map item values to items
            for (const value of params.getAll(key)) {
                const existingFilter = groupItemsByValue.get(
                    getValueFromFilterString(value)
                );

                if (existingFilter) {
                    items.add(existingFilter);
                } else {
                    console.warn(
                        `Existing filter ${value} not found in possible filters`
                    );
                }
            }

            // add items to the next state, keyed by group
            nextState.set(group, items);
        }
    }

    return nextState;
};

/**
 * Looks for filter values within a search string and returns a map like
 * {
 *   "category_id": ["Bottoms,28", "Pants & Shorts,19"]
 * }
 * filter[category_id]=Bottoms,28&filter[category_id]=Pants & Shorts,19
 * @param {String} initialValue a search string, as in from location.search
 */
export const getFiltersFromSearch = initialValue => {
    // preserve all existing params
    const params = new URLSearchParams(initialValue);
    const uniqueKeys = new Set(params.keys());
    const filters = new Map();

    // iterate over existing param keys
    for (const key of uniqueKeys) {
        // if a key matches a known filter, add its items to the next state
        if (key.endsWith('[filter]')) {
            // derive the group by slicing off `[filter]`
            const group = key.slice(0, -8);
            const items = new Set();

            // map item values to items
            for (const value of params.getAll(key)) {
                items.add(value);
            }

            // add items to the next state, keyed by group
            filters.set(group, items);
        }
    }

    return filters;
};

export const stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');

/** GetFilterInput helpers below. */
const getValueFromFilterString = keyValueString =>
    keyValueString.split(DELIMITER)[1];

/**
 * Converts a set of values to a range filter
 * @param {Set} values
 */
const toRangeFilter = values => {
    // Range should always only be a single string. In the event we received
    // multiple, just return the first.
    const rangeString = getValueFromFilterString(Array.from(values)[0]);

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
    if (values.size > 1) {
        return {
            in: Array.from(values).map(getValueFromFilterString)
        };
    } else {
        return {
            eq: getValueFromFilterString(Array.from(values)[0])
        };
    }
};

/**
 * Converts a set of values into a match filter
 * @param {Set} values
 */
const toMatchFilter = values => {
    return { match: getValueFromFilterString(Array.from(values)[0]) };
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
        throw TypeError(`Unknown type ${type}`);
    }

    return conversionFunction(values);
};
