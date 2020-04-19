import { useState, useMemo } from 'react';

const defaultSortAttribute = 'relevance';
const defaultSortDirection = 'DESC';

export const useSort = (props = {}) => {
    const [sort, setSort] = useState({
        sortAttribute: props.sortAttribute ||  defaultSortAttribute,
        sortDirection: props.sortDirection || defaultSortDirection
    });

    const { sortAttribute, sortDirection } = sort;

    const sortControl = {
        currentSort: sort,
        setSort: setSort
    };

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

    const api = useMemo(
        () => ({
            sortControl
        }),
        [sortControl]
    );

    return {sortText, api};
};
