import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '../../util/shallowMerge';
import { useFilterState } from './useFilterState';
import {
    getSearchFromState,
    getStateFromSearch,
    sortFiltersArray,
    stripHtml
} from './helpers';

import DEFAULT_OPERATIONS from './filterModal.gql';

const DRAWER_NAME = 'filter';

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

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getFilterInputsQuery } = operations;

    const [isApplying, setIsApplying] = useState(false);
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const [filterState, filterApi] = useFilterState();
    const prevDrawer = useRef(null);
    const isOpen = drawer === DRAWER_NAME;

    const history = useHistory();
    const { pathname, search } = useLocation();

    const { data: introspectionData } = useQuery(getFilterInputsQuery);

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
            disabled.add('category_uid');
        }

        return disabled;
    }, [pathname]);

    // Get "allowed" filters by intersection of filter attribute codes and
    // schema input field types. This restricts the displayed filters to those
    // that the api will understand.
    const possibleFilters = useMemo(() => {
        const nextFilters = new Set();
        const inputFields = introspectionData
            ? introspectionData.__type.inputFields
            : [];

        // perform mapping and filtering in the same cycle
        for (const { name } of inputFields) {
            const isValid = attributeCodes.includes(name);
            const isEnabled = !DISABLED_FILTERS.has(name);

            if (isValid && isEnabled) {
                nextFilters.add(name);
            }
        }

        return nextFilters;
    }, [DISABLED_FILTERS, attributeCodes, introspectionData]);

    const isBooleanFilter = options => {
        const optionsString = JSON.stringify(options);
        return (
            options.length <= 2 &&
            (optionsString.includes(
                JSON.stringify({
                    __typename: 'AggregationOption',
                    label: '0',
                    value: '0'
                })
            ) ||
                optionsString.includes(
                    JSON.stringify({
                        __typename: 'AggregationOption',
                        label: '1',
                        value: '1'
                    })
                ))
        );
    };

    // iterate over filters once to set up all the collections we need
    const [
        filterNames,
        filterKeys,
        filterItems,
        filterFrontendInput
    ] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const frontendInput = new Map();
        const itemsByGroup = new Map();

        const sortedFilters = sortFiltersArray([...filters]);

        for (const filter of sortedFilters) {
            const { options, label: name, attribute_code: group } = filter;

            // If this aggregation is not a possible filter, just back out.
            if (possibleFilters.has(group)) {
                const items = [];

                // add filter name
                names.set(group, name);

                // add filter key permutations
                keys.add(`${group}[filter]`);

                // TODO: Get all frontend input type from gql if other filter input types are needed
                // See: https://github.com/magento-commerce/magento2-pwa/pull/26
                if (isBooleanFilter(options)) {
                    frontendInput.set(group, 'boolean');
                    // add items
                    items.push({
                        title: 'No',
                        value: '0',
                        label: name + ':' + 'No'
                    });
                    items.push({
                        title: 'Yes',
                        value: '1',
                        label: name + ':' + 'Yes'
                    });
                } else {
                    // Add frontend input type
                    frontendInput.set(group, null);
                    // add items
                    for (const { label, value } of options) {
                        items.push({ title: stripHtml(label), value });
                    }
                }

                itemsByGroup.set(group, items);
            }
        }

        return [names, keys, itemsByGroup, frontendInput];
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

    const handleOpen = useCallback(() => {
        toggleDrawer(DRAWER_NAME);
    }, [toggleDrawer]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
        handleClose();
    }, [handleClose]);

    const handleReset = useCallback(() => {
        filterApi.clear();
        setIsApplying(true);
    }, [filterApi, setIsApplying]);

    const handleKeyDownActions = useCallback(
        event => {
            // do not handle keyboard actions when the modal is closed
            if (!isOpen) {
                return;
            }

            switch (event.keyCode) {
                // when "Esc" key fired -> close the modal
                case 27:
                    handleClose();
                    break;
            }
        },
        [isOpen, handleClose]
    );

    useEffect(() => {
        const justOpened =
            prevDrawer.current === null && drawer === DRAWER_NAME;
        const justClosed =
            prevDrawer.current === DRAWER_NAME && drawer === null;

        // on drawer toggle, read filter state from location
        if (justOpened || justClosed) {
            const nextState = getStateFromSearch(
                search,
                filterKeys,
                filterItems
            );

            filterApi.setItems(nextState);
        }

        // on drawer close, update the modal visibility state
        if (justClosed) {
            handleClose();
        }

        prevDrawer.current = drawer;
    }, [drawer, filterApi, filterItems, filterKeys, search, handleClose]);

    return {
        filterApi,
        filterItems,
        filterKeys,
        filterNames,
        filterFrontendInput,
        filterState,
        handleApply,
        handleClose,
        handleKeyDownActions,
        handleOpen,
        handleReset,
        isApplying,
        isOpen
    };
};
