import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine';

import { getSearchParam } from '../../hooks/useSearchParam';
import { getFiltersFromSearch, getFilterInput } from '../FilterModal/helpers';
const PAGE_SIZE = 6;

/**
 * Return props necessary to render a SearchPage component.
 *
 * @param {Object} props
 * @param {String} props.query - graphql query used for executing search
 */
export const useSearchPage = props => {
    const {
        queries: {
            filterIntrospection,
            getProductFiltersBySearch,
            productSearch
        }
    } = props;

    const [sort, setSort] = useState({
        sortAttribute: 'relevance',
        sortDirection: 'DESC'
    });

    const { sortAttribute, sortDirection } = sort;

    const sortControl = {
        currentSort: sort,
        setSort: setSort
    };

    // Set up pagination.
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    // retrieve app state and action creators
    const [appState, appApi] = useAppContext();
    const { searchOpen } = appState;
    const { toggleDrawer, toggleSearch } = appApi;

    // get the URL query parameters.
    const location = useLocation();
    const { search } = location;
    const inputText = getSearchParam('query', location);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    const openDrawer = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

    // derive initial state from query params
    // never re-run this effect, even if deps change
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // ensure search is open to begin with
        if (toggleSearch && !searchOpen && inputText) {
            toggleSearch();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    // Get "allowed" filters by intersection of schema and aggregations
    const {
        called: introspectionCalled,
        data: introspectionData,
        error: introspectionError,
        loading: introspectionLoading
    } = useQuery(filterIntrospection);

    useEffect(() => {
        if (introspectionError) {
            console.error(introspectionError);
        }
    }, [introspectionError]);

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
    ] = useLazyQuery(productSearch);

    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size) {
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
                pageSize: Number(PAGE_SIZE),
                sort: { [sortAttribute]: sortDirection }
            }
        });

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [
        currentPage,
        filterTypeMap,
        inputText,
        runQuery,
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

    // Reset the current page back to one (1) when the search string or filters
    // change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (prevSearch.toString() != nextSearch.toString()) {
            // The search term changed.
            setCurrentPage(1);
            // And update the ref.
            previousSearch.current = search;
        }
    }, [search, setCurrentPage]);

    // Fetch category filters for when a user is searching in a category.
    const [getFilters, { data: filterData, error: filterError }] = useLazyQuery(
        getProductFiltersBySearch
    );

    useEffect(() => {
        if (filterError) {
            console.error(filterError);
        }
    }, [filterError]);

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

    const sortText = useMemo(() => {
        if (sortAttribute === 'relevance') {
            return 'Best Match';
        }

        if (sortAttribute === 'price') {
            if (sortDirection === 'ASC') {
                return 'Price: Low to High';
            }
            return 'Price: High to Low';
        }
    }, [sortAttribute, sortDirection]);

    return {
        data,
        error,
        filters,
        loading,
        openDrawer,
        pageControl,
        sortControl,
        sortText
    };
};
