import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useLocation } from 'react-router-dom';
import gql from 'graphql-tag';

import { useAppContext } from '@magento/peregrine/lib/context/app';

import { getSearchFromState, getStateFromSearch, stripHtml } from './helpers';
import { useFilterState } from './useFilterState';

const FilterIntrospectionQuery = gql`
    query getFilterInputs {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
            }
        }
    }
`;

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

    const { data: introspectionData, error: introspectionError } = useQuery(
        FilterIntrospectionQuery
    );

    useEffect(() => {
        if (introspectionError) {
            console.error(introspectionError);
        }
    }, [introspectionError]);

    // Get "allowed" filters by intersection of aggregation attribute codes and
    // schema input field types. This restricts the displayed filters to those
    // that the api will understand.
    const possibleFilters = useMemo(() => {
        let nextFilters;
        if (introspectionData) {
            nextFilters = introspectionData.__type.inputFields
                .map(field => field.name)
                .filter(filterName =>
                    filters
                        .map(filter => filter.attribute_code)
                        .includes(filterName)
                )
                // Price aggregation is strange in that when you select one such
                // as 0-100, the next aggregation set may not include the chosen
                // value and label which means we don't, on subsequent render,
                // know what to display for the selected price filter.
                //
                // If you want to display price as a filter, remove the line below.
                .filter(name => name != 'price')
                // Category aggregation is also strange because there seems to
                // be no way to filter by child categories _within_ a parent category.
                // If you want to display category as a filter, remove the line below.
                .filter(name => name != 'category_id');
        }
        return nextFilters || [];
    }, [filters, introspectionData]);

    const [filterNames, filterKeys, filterItems] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const itemsByGroup = new Map();

        for (const filter of filters) {
            const { options, label: name, attribute_code: group } = filter;

            // If this aggregation is not a possible filter, just back out.
            if (possibleFilters.includes(group)) {
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
