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
    sortDirection: 'ASC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) => {
    const { isSearch = false } = props;
    return useState(() =>
        Object.assign({}, isSearch ? searchSort : defaultSort, props)
    );
};
