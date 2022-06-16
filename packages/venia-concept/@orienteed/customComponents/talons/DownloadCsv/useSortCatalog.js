import { useState } from 'react';

// TODO: Read the default/initial sort from config.
const defaultSort = {
    sortText: 'Full Catalog',
    sortId: 'fullCatalog',
    sortAttribute: 'fullCatalog',
    sortDirection: 'ASC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSortCatalog = (props = {}) => useState(() => Object.assign({}, props));
