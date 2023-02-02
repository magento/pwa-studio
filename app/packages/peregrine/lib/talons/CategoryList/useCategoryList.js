/* Deprecated in PWA-12.1.0*/

import { useQuery } from '@apollo/client';

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
    const { getCategoryListQuery, getStoreConfigQuery } = operations;

    const { loading, error, data } = useQuery(getCategoryListQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !id,
        variables: {
            id
        }
    });

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        childCategories:
            (data &&
                data.categories.items[0] &&
                data.categories.items[0].children) ||
            null,
        storeConfig,
        error,
        loading
    };
};
