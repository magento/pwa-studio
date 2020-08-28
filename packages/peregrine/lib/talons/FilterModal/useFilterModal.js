import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';

import { getSearchFromState, getStateFromSearch, stripHtml } from './helpers';
import { useFilterState } from './useFilterState';

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
export const useFilterModal = props => {
    const {
        filters,
        queries: { filterIntrospection }
    } = props;
    const [isApplying, setIsApplying] = useState(false);
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [filterState, filterApi] = useFilterState();
    const prevDrawer = useRef(null);
    const isOpen = drawer === 'filter';

    const history = useHistory();
    const { pathname, search } = useLocation();

    const { data: introspectionData } = useQuery(filterIntrospection);

    const inputFields = introspectionData
        ? introspectionData.__type.inputFields
        : [];

    const attributeCodes = useMemo(
        () => filters.map(({ attribute_code }) => attribute_code),
        [filters]
    );

    // Create a set of disabled filters.
    const DISABLED_FILTERS = useMemo(() => {
        const disabled = new Set();
        // Disable category filtering when not on a search page.
        if (pathname !== '/search.html') {
            disabled.add('category_id');
        }

        return disabled;
    }, [pathname]);

    // Get "allowed" filters by intersection of filter attribute codes and
    // schema input field types. This restricts the displayed filters to those
    // that the api will understand.
    const possibleFilters = useMemo(() => {
        const nextFilters = new Set();

        // perform mapping and filtering in the same cycle
        for (const { name } of inputFields) {
            const isValid = attributeCodes.includes(name);
            const isEnabled = !DISABLED_FILTERS.has(name);

            if (isValid && isEnabled) {
                nextFilters.add(name);
            }
        }

        return nextFilters;
    }, [DISABLED_FILTERS, attributeCodes, inputFields]);

    // iterate over filters once to set up all the collections we need
    const [filterNames, filterKeys, filterItems] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const itemsByGroup = new Map();

        for (const filter of filters) {
            const { options, label: name, attribute_code: group } = filter;

            // If this aggregation is not a possible filter, just back out.
            if (possibleFilters.has(group)) {
                const items = [];

                // add filter name
                names.set(group, name);

                // add filter key permutations
                keys.add(`${group}[filter]`);

                // add items
                for (const { label, value } of options) {
                    items.push({ title: stripHtml(label), value });
                }
                itemsByGroup.set(group, items);
            }
        }

        return [names, keys, itemsByGroup];
    }, [filters, possibleFilters]);

    // on apply, write filter state to location
    useEffect(() => {
        if (isApplying) {
            const nextSearch = getSearchFromState(
                search,
                filterKeys,
                filterState
            );

            // write filter state to history
            history.push({ pathname, search: nextSearch });

            // mark the operation as complete
            setIsApplying(false);
        }
    }, [filterKeys, filterState, history, isApplying, pathname, search]);

    // on drawer toggle, read filter state from location
    useEffect(() => {
        const justOpened = prevDrawer.current === null && drawer === 'filter';
        const justClosed = prevDrawer.current === 'filter' && drawer === null;

        if (justOpened || justClosed) {
            const nextState = getStateFromSearch(
                search,
                filterKeys,
                filterItems
            );

            filterApi.setItems(nextState);
        }
        prevDrawer.current = drawer;
    }, [drawer, filterApi, filterItems, filterKeys, search]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
        closeDrawer();
    }, [closeDrawer]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    const handleReset = useCallback(() => {
        filterApi.clear();
        setIsApplying(true);
    }, [filterApi, setIsApplying]);

    return {
        filterApi,
        filterItems,
        filterKeys,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        handleReset,
        isApplying,
        isOpen
    };
};
