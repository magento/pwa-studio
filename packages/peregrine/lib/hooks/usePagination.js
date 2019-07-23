import { useMemo, useState } from 'react';

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(null);

    const paginationState = { currentPage, totalPages };
    const api = useMemo(() => ({ setCurrentPage, setTotalPages }), [
        setCurrentPage,
        setTotalPages
    ]);

    return [paginationState, api];
};
