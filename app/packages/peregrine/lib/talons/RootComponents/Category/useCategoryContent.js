import { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import { useEventingContext } from '../../../context/eventing';

import DEFAULT_OPERATIONS from './categoryContent.gql';

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {string} result.categoryDescription - This category's description.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {object} result.items - The items in this category.
 * @returns {number} result.totalPagesFromData - The total amount of pages for the query.
 */
export const useCategoryContent = props => {
    const { categoryId, data, pageSize = 6 } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getCategoryDataQuery,
        getProductAggregationsFilteredByCategoryQuery,
        getAvailableSortMethodsByCategoryQuery
    } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);
    const [items, setItems] = useState([]);

    const [getFilters, { data: filterData }] = useLazyQuery(getProductAggregationsFilteredByCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [getSortMethods, { data: sortData }] = useLazyQuery(getAvailableSortMethodsByCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: categoryData, loading: categoryLoading } = useQuery(getCategoryDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !categoryId,
        variables: {
            id: categoryId
        }
    });

    const [, { dispatch }] = useEventingContext();

    useEffect(() => {
        if (categoryId) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    }
                }
            });
        }
    }, [categoryId, getFilters]);

    useEffect(() => {
        if (categoryId) {
            getSortMethods({
                variables: {
                    categoryIdFilter: {
                        in: categoryId
                    }
                }
            });
        }
    }, [categoryId, getSortMethods]);

    useEffect(() => {
        if (data) {
            const itemsData = data ? data.products.items : placeholderItems;
            setItems(itemsData);
        }
    }, [data, placeholderItems]);

    const filters = filterData ? filterData.products.aggregations : null;
    const totalPagesFromData = data ? data.products.page_info.total_pages : null;
    const totalCount = data ? data.products.total_count : null;
    const categoryName =
        categoryData && categoryData.categories.items.length ? categoryData.categories.items[0].name : null;
    const categoryDescription =
        categoryData && categoryData.categories.items.length ? categoryData.categories.items[0].description : null;
    const availableSortMethods = sortData ? sortData.products.sort_fields.options : null;

    useEffect(() => {
        if (!categoryLoading && categoryData.categories.items.length > 0) {
            dispatch({
                type: 'CATEGORY_PAGE_VIEW',
                payload: {
                    id: categoryData.categories.items[0].uid,
                    name: categoryData.categories.items[0].name,
                    url_key: categoryData.categories.items[0].url_key,
                    url_path: categoryData.categories.items[0].url_path
                }
            });
        }
    }, [categoryData, dispatch, categoryLoading]);

    return {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData
    };
};
