import { useMemo, useState } from 'react';

/**
 * `usePagination` provides a pagination state with `currentPage` and
 * `totalPages` as well as an API for interacting with the state.
 *
 * @param {Number} initialPage the initial current page value
 *
 * @returns {[PaginationState, PaginationApi]}
 */
export const usePagination = (initialPage = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(null);

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
    const api = useMemo(() => ({ setCurrentPage, setTotalPages }), [
        setCurrentPage,
        setTotalPages
    ]);

    return [paginationState, api];
};
