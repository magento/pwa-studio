import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine';

import { getSearchParam } from '../../hooks/useSearchParam';

const PAGE_SIZE = 6;

/**
 * Return props necessary to render a SearchPage component.
 *
 * @param {Object} props
 * @param {String} props.query - graphql query used for executing search
 */
export const useSearchPage = props => {
    const { query } = props;

    // Set up pagination.
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    // retrieve app state and action creators
    const [appState, appApi] = useAppContext();
    const { searchOpen } = appState;
    const { executeSearch, toggleDrawer, toggleSearch } = appApi;

    // get the URL query parameters.
    const location = useLocation();
    const inputText = getSearchParam('query', location);
    const categoryId = getSearchParam('category', location);

    // Keep track of the search terms so we can tell when they change.
    const [previousInputText, setPreviousInputText] = useState(inputText);
    const [previousCategoryId, setPreviousCategoryId] = useState(categoryId);

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

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    let apolloQueryVariable = {
        currentPage: Number(currentPage),
        inputText,
        pageSize: PAGE_SIZE
    };

    if (categoryId) {
        apolloQueryVariable = {
            ...apolloQueryVariable,
            filters: {
                category_id: { eq: String(categoryId) }
            }
        };
    }

    // TODO: Make this a lazy query that can be re-run after variables change.
    const { loading, error, data } = useQuery(query, {
        variables: apolloQueryVariable
    });

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

    // Reset the current page back to one (1) when the query or category changes.
    useEffect(() => {
        if (
            previousInputText !== inputText ||
            previousCategoryId !== categoryId
        ) {
            // The search term changed.
            setCurrentPage(1);
        }

        // And update the state.
        setPreviousCategoryId(categoryId);
        setPreviousInputText(inputText);
    }, [
        categoryId,
        inputText,
        previousCategoryId,
        previousInputText,
        setCurrentPage
    ]);

    return {
        loading,
        error,
        data,
        executeSearch,
        categoryId,
        openDrawer,
        pageControl
    };
};
