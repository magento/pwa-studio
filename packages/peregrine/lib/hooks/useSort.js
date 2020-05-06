import { useState } from 'react';

const defaultSort = {
    sortText: 'Best Match',
    sortAttribute: 'relevance',
    sortDirection: 'DESC'
};

export const useSort = (props = {}) =>
    useState(() => Object.assign({}, defaultSort, props));
