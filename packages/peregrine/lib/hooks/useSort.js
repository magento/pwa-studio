import { useState } from 'react';

// TODO: Read the default/initial sort from config.
const defaultSort = {
    sortText: 'Position',
    sortId: 'sortItem.position',
    sortAttribute: 'position',
    sortDirection: 'ASC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) =>
    useState(() => Object.assign({}, defaultSort, props));
