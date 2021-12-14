import { useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';

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
        getCategoryContentQuery,
        getProductFiltersByCategoryQuery,
        getCategoryAvailableSortMethodsQuery
    } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);

    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [getSortMethods, { data: sortData }] = useLazyQuery(
        getCategoryAvailableSortMethodsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const { data: categoryData } = useQuery(getCategoryContentQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !categoryId,
        variables: {
            id: categoryId
        }
    });

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
                        eq: categoryId
                    }
                }
            });
        }
    }, [categoryId, getSortMethods]);

    const filters = filterData ? filterData.products.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;
    const totalCount = data ? data.products.total_count : null;
    const categoryName = categoryData
        ? categoryData.categories.items[0].name
        : null;
    const categoryDescription = categoryData
        ? categoryData.categories.items[0].description
        : null;
    const sortingMethods = sortData
        ? sortData?.products?.sort_fields?.options
        : null;
    // price needs to be bidirectional
    const priceSortingPropsDescending = {
        id: 'sortItem.priceDesc',
        text: 'Price: High to Low',
        attribute: 'price',
        sortDirection: 'DESC'
    };

    const priceSortingPropsAscending = {
        id: 'sortItem.priceAsc',
        text: 'Price: Low to High',
        attribute: 'price',
        sortDirection: 'ASC'
    };
    const sortMethodsArray = [
        priceSortingPropsAscending,
        priceSortingPropsDescending
    ];
    const sortingMethodsDirections = sortingMethods
        ? sortingMethods
              .map(method => {
                  let sortingProps;

                  if (method.value !== 'price') {
                      sortingProps = {
                          ...sortingProps,
                          id: `sortItem.${method.value}`,
                          text: `${method.label}`,
                          attribute: method.value,
                          sortDirection: 'ASC'
                      };
                  }

                  return sortingProps;
              })
              .filter(method => method !== undefined)
        : null;
    // ensures sorting method always exists
    const availableSortMethods = sortingMethodsDirections
        ? [sortingMethodsDirections, sortMethodsArray].flat()
        : sortMethodsArray;

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
