import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { useFilterState } from './useFilterState';

const stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');

// const fromParamString = (filterKeys, initialValue) => {
//     const params = new URLSearchParams(initialValue)
// }

const toParamString = (filterState, filterKeys, initialValue) => {
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

/**
 * Filter Modal talon.
 *
 * @returns {{
 *   filterApi: any,
 *   filterState: any,
 *   handleClose: function,
 *   isOpen: boolean
 * }}
 */
export const useFilterModal = filters => {
    const [isApplying, setIsApplying] = useState(false);
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [filterState, filterApi] = useFilterState();
    const prevDrawer = useRef(null);
    const isOpen = drawer === 'filter';

    const history = useHistory();
    const { pathname, search } = useLocation();

    // iterate over filters once to set up all the collections we need
    const [filterNames, filterKeys, filterItems] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const itemsByGroup = new Map();

        for (const filter of filters) {
            const { filter_items, name, request_var: group } = filter;
            const items = [];

            // add filter name
            names.set(group, name);

            // add filter key permutations
            keys.add(`${group}[title]`);
            keys.add(`${group}[value]`);

            // add items
            for (const { label, value_string: value } of filter_items) {
                items.push({ title: stripHtml(label), value });
            }
            itemsByGroup.set(group, items);
        }

        return [names, keys, itemsByGroup];
    }, [filters]);

    // on apply, write filter state to history and close the drawer
    useEffect(() => {
        if (isApplying) {
            const nextSearch = toParamString(filterState, filterKeys, search);

            // write filter state to history
            history.push({ pathname, search: nextSearch });
            // close the drawer
            closeDrawer();
            // mark the operation as complete
            setIsApplying(false);
        }
    }, [
        closeDrawer,
        filterKeys,
        filterState,
        history,
        isApplying,
        pathname,
        search
    ]);

    // on drawer close, read filter state from location
    useEffect(() => {
        if (prevDrawer.current === 'filter' && drawer === null) {
            console.log('TODO: read filter state from location');
        }
        prevDrawer.current = drawer;
    }, [drawer, filterApi, search]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
    }, [setIsApplying]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        filterApi,
        filterItems,
        filterKeys,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        isApplying,
        isOpen
    };
};
