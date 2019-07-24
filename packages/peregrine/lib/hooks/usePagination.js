import { useCallback, useMemo, useState } from 'react';
import { getSearchParam } from './useSearchParam';

/**
 * Sets a query parameter in history. Attempt to use React Router if provided
 * otherwise fallback to builtins.
 */
const setQueryParam = ({ location, history, parameter, value }) => {
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    queryParams.set(parameter, value);

    if (history.push) {
        history.push({ search: queryParams.toString() });
    } else {
        // Use the native pushState. See https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
        history.pushState({ search: queryParams.toString() }, '');
    }
};

const defaultInitialPage = 1;

/**
 * `usePagination` provides a pagination state with `currentPage` and
 * `totalPages` as well as an API for interacting with the state.
 *
 * @param {Object} location the location object, like window.location, or from react router
 * @param {Object} history the history object, like window.history, or from react router
 * @param {String} namespace the namespace to apply to the pagination query
 * @param {String} parameter the name of the query parameter to use for page
 * @param {Number} initialPage the initial current page value
 * @param {Number} intialTotalPages the total pages expected to be usable by this hook
 *
 * TODO update with defaults
 *
 * @returns {[PaginationState, PaginationApi]}
 */
export const usePagination = ({
    location = window.location,
    history = window.history,
    namespace = '',
    parameter = 'page',
    initialPage,
    initialTotalPages = 1
} = {}) => {
    const searchParam = namespace ? `${namespace}_${parameter}` : parameter;
    if (!initialPage) {
        // We need to synchronously fetch the initial page value from the query
        // param otherwise we would initialize this value twice.
        initialPage = parseInt(
            getSearchParam(searchParam, location) || defaultInitialPage
        );
    }

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);

    const setPage = useCallback(
        page => {
            // Update the query parameter.
            setQueryParam({
                location,
                history,
                parameter: searchParam,
                value: page
            });

            // Update the state object.
            setCurrentPage(page);
        },
        [history, location, searchParam]
    );

    /**
     * @typedef PaginationState
     * @property {Number} currentPage the current page
     * @property {Number} totalPages the total pages
     */
    const paginationState = { currentPage, totalPages };

    /**
     * @typedef PaginationApi
     * @property {Function} setCurrentPage
     * @property {Function} setTotalPages
     */
    const api = useMemo(
        () => ({
            setCurrentPage: setPage,
            setTotalPages
        }),
        [setPage, setTotalPages]
    );

    return [paginationState, api];
};
