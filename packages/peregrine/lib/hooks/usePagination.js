import { useCallback, useMemo, useState } from 'react';
import { getSearchParam } from './useSearchParam';

/**
 * Sets a query parameter in history. Attempt to use React Router if provided
 * otherwise fallback to builtins.
 *
 * @private
 */
const setQueryParam = ({ location, history, parameter, value }) => {
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    queryParams.set(parameter, value);

    if (history.push) {
        history.push({ search: queryParams.toString() });
    } else {
        // Use the native pushState. See https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
        history.pushState('', '', `?${queryParams.toString()}`);
    }
};

const defaultInitialPage = 1;

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that provides
 * pagination logic.
 *
 * Use this hook to implement components that need to navigate through paged
 * data.
 *
 * @kind function
 *
 * @param {Object} config An object containing configuration values
 *
 * @param {Object} config.location=window.location The location object, such as window.location or from react router
 * @param {Object} config.history=window.history The history object, such as window.history or from react router
 * @param {String} config.namespace='' The namespace to append to config.parameter in the query. For example: ?namespace_parameter=value
 * @param {String} config.parameter='page' The name of the query parameter to use for page
 * @param {Number} config.initialPage The initial current page value
 * @param {Number} config.intialTotalPages=1 The total pages expected to be usable by this hook
 *
 * @return {Object[]} An array with two entries containing the following content: [ {@link PaginationState}, {@link API} ]
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
     * The current pagination state
     *
     * @typedef PaginationState
     *
     * @kind Object
     *
     * @property {Number} currentPage The current page number
     * @property {Number} totalPages The total number of pages
     */
    const paginationState = { currentPage, totalPages };

    /**
     * The API object used for modifying the PaginationState.
     *
     * @typedef API
     *
     * @kind Object
     */
    /**
     * Set the current page
     *
     * @function API.setCurrentPage
     *
     * @param {Number} page The number to assign to the current page
     */
    /**
     * Set the total number of pages
     *
     * @function API.setTotalPages
     *
     * @param {Number} total The number to set the amount of pages available
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
