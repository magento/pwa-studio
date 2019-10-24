import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    const { filters } = props;
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
    }, [drawer, filterApi, filterKeys, filterItems, search]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
        closeDrawer();
    }, [closeDrawer, setIsApplying]);

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
