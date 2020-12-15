import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';

import DEFAULT_OPERATIONS from './categoryList.gql';

/**
 * Returns props necessary to render a CategoryList component.
 *
 * @param {object} props
 * @param {object} props.query - category data
 * @param {string} props.id - category id
 * @return {{ childCategories: array, error: object }}
 */
export const useCategoryList = props => {
    const { id } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryListQuery } = operations;

    const [runQuery, queryResponse] = useLazyQuery(getCategoryListQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { loading, error, data } = queryResponse;

    // Run the query immediately and every time id changes.
    useEffect(() => {
        if (id) {
            runQuery({ variables: { id } });
        }
    }, [id, runQuery]);

    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        error,
        loading
    };
};
