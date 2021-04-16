import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import mergeOperations from '../../util/shallowMerge';
import { useAppContext } from '../../context/app';
import { usePagination } from '../../hooks/usePagination';
import { useScrollTopOnChange } from '../../hooks/useScrollTopOnChange';
import { getSearchParam } from '../../hooks/useSearchParam';
import { useSort } from '../../hooks/useSort';
import { getFiltersFromSearch, getFilterInput } from '../FilterModal/helpers';

import DEFAULT_OPERATIONS from './searchPage.gql';

/**
 * Return props necessary to render a SearchPage component.
 *
 * @param {Object} props
 * @param {String} props.query - graphql query used for executing search
 */
export const useSearchPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getFilterInputsQuery,
        getPageSize,
        getProductFiltersBySearchQuery,
        productSearchQuery
    } = operations;

    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;

    const sortProps = useSort();
    const [currentSort] = sortProps;
    const { sortAttribute, sortDirection } = currentSort;
    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    // get the URL query parameters.
    const location = useLocation();
    const { search } = location;
    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Set up pagination.
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    // retrieve app state and action creators
    const [, appApi] = useAppContext();
    const {
        toggleDrawer,
        actions: { setPageLoading }
    } = appApi;

    const inputText = getSearchParam('query', location);

    const searchCategory = useMemo(() => {
        const inputFilters = getFiltersFromSearch(search);
        if (inputFilters.size === 0) {
            return null;
        }

        const targetCategoriesSet = inputFilters.get('category_id');
        if (!targetCategoriesSet) {
            return null;
        }

        // The set looks like ["Bottoms,11", "Skirts,12"].
        // We want to return "Bottoms, Skirts", etc.
        return [...targetCategoriesSet]
            .map(categoryPair => categoryPair.split(',')[0])
            .join(', ');
    }, [search]);

    const openDrawer = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

    // Get "allowed" filters by intersection of schema and aggregations
    const {
        called: introspectionCalled,
        data: introspectionData,
        loading: introspectionLoading
    } = useQuery(getFilterInputsQuery);

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        runQuery,
        { called: searchCalled, loading: searchLoading, error, data }
    ] = useLazyQuery(productSearchQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const isBackgroundLoading = !!data && searchLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }
        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        runQuery({
            variables: {
                currentPage: Number(currentPage),
                filters: newFilters,
                inputText,
                pageSize: Number(pageSize),
                sort: { [sortAttribute]: sortDirection }
            }
        });
    }, [
        currentPage,
        filterTypeMap,
        inputText,
        runQuery,
        pageSize,
        search,
        sortDirection,
        sortAttribute
    ]);

    // Set the total number of pages whenever the data changes.
    useEffect(() => {
        const totalPagesFromData = data
            ? data.products.page_info.total_pages
            : null;

        setTotalPages(totalPagesFromData);

        return () => {
            setTotalPages(null);
        };
    }, [data, setTotalPages]);

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, search, setCurrentPage]);

    // Fetch category filters for when a user is searching in a category.
    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersBySearchQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    useEffect(() => {
        if (inputText) {
            getFilters({
                variables: {
                    search: inputText
                }
            });
        }
    }, [getFilters, inputText, search]);

    // Use static category filters when filtering by category otherwise use the
    // default (and potentially changing!) aggregations from the product query.
    const filters = filterData ? filterData.products.aggregations : null;

    // Avoid showing a "empty data" state between introspection and search.
    const loading =
        (introspectionCalled && !searchCalled) ||
        searchLoading ||
        introspectionLoading;

    useScrollTopOnChange(currentPage);

    return {
        data,
        error,
        filters,
        loading,
        openDrawer,
        pageControl,
        searchCategory,
        searchTerm: inputText,
        sortProps
    };
};
