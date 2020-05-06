import { useState } from 'react';

// const defaultSortText = 'Best Match';
// const defaultSortAttribute = 'relevance';
// const defaultSortDirection = 'DESC';

const defaultSort = {
    sortText: 'Best Match',
    sortAttribute: 'relevance',
    sortDirection: 'DESC'
};

export const useSort = (props = {}) =>
    useState(() => Object.assign({}, defaultSort, props));
