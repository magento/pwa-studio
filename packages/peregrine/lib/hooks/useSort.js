import { useState, useMemo } from 'react';

const defaultSortText = 'Best Match';
const defaultSortAttribute = 'relevance';
const defaultSortDirection = 'DESC';

export const useSort = (props = {}) => {
    const [currentSort, setSort] = useState({
        sortText: props.sortText || defaultSortText,
        sortAttribute: props.sortAttribute || defaultSortAttribute,
        sortDirection: props.sortDirection || defaultSortDirection
    });

    const api = useMemo(
        () => ({
            setSort
        }),
        [setSort]
    );

    return { currentSort, api };
};
