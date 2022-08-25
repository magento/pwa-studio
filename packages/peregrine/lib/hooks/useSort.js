import { useState } from 'react';

// TODO: Read the default/initial sort from config.
const defaultSort = {
    sortText: 'Position',
    sortId: 'sortItem.position',
    sortAttribute: 'position',
    sortDirection: 'ASC'
};

const searchSort = {
    sortText: 'Best Match',
    sortId: 'sortItem.relevance',
    sortAttribute: 'relevance',
    sortDirection: 'DESC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) => {
    const { sortFromSearch = false } = props;
    return useState(() =>
        Object.assign({}, sortFromSearch ? searchSort : defaultSort, props)
    );
};
