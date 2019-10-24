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
            nextParams.append(`${group}[title]`, `${title}`);
            nextParams.append(`${group}[value]`, `${value}`);
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
        if (filterKeys.has(key) && key.endsWith('[value]')) {
            // derive the group by slicing off `[value]`
            const group = key.slice(0, -7);
            const items = new Set();
            const groupItemsByValue = new Map();

            // cache items by value to avoid inefficient lookups
            for (const item of filterItems.get(group)) {
                groupItemsByValue.set(item.value, item);
            }

            // map item values to items
            for (const value of params.getAll(key)) {
                items.add(groupItemsByValue.get(value));
            }

            // add items to the next state, keyed by group
            nextState.set(group, items);
        }
    }

    return nextState;
};

export const stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');
