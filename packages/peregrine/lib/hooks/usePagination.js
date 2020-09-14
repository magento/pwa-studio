import { useCallback, useMemo, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { getSearchParam } from './useSearchParam';

/**
 * Sets a query parameter in history.
 *
 * @private
 */
const setQueryParam = ({ history, location, parameter, replace, value }) => {
    const { search } = location;
    const queryParams = new URLSearchParams(search);

    queryParams.set(parameter, value);
    const destination = { search: queryParams.toString() };

    if (replace) {
        history.replace(destination);
    } else {
        history.push(destination);
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
 * @param {String} config.namespace='' The namespace to append to config.parameter in the query. For example: ?namespace_parameter=value
 * @param {String} config.parameter='page' The name of the query parameter to use for page
 * @param {Number} config.initialPage The initial current page value
 * @param {Number} config.initialTotalPages=1 The total pages expected to be usable by this hook
 *
 * @return {Object[]} An array with two entries containing the following content: [ {@link PaginationState}, {@link API} ]
 */
export const usePagination = (props = {}) => {
    const { namespace = '', parameter = 'page', initialTotalPages = 1 } = props;

    const history = useHistory();
    const location = useLocation();
    const [totalPages, setTotalPages] = useState(initialTotalPages);

    const searchParam = namespace ? `${namespace}_${parameter}` : parameter;
    const initialPage = props.initialPage || defaultInitialPage;
    const currentPage = parseInt(getSearchParam(searchParam, location));

    // use the location to hold state
    const setCurrentPage = useCallback(
        (page, replace = false) => {
            // Update the query parameter.
            setQueryParam({
                history,
                location,
                parameter: searchParam,
                replace,
                value: page
            });
        },
        [history, location, searchParam]
    );

    // ensure the location contains a page number
    useEffect(() => {
        if (!currentPage) {
            setCurrentPage(initialPage, true);
        }
    }, [currentPage, initialPage, setCurrentPage]);

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
    const paginationState = {
        currentPage: currentPage || initialPage,
        totalPages
    };

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
            setCurrentPage,
            setTotalPages
        }),
        [setCurrentPage, setTotalPages]
    );

    return [paginationState, api];
};
