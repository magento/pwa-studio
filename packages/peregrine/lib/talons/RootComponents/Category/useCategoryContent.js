import { useEffect, useState, createContext } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import { useEventingContext } from '../../../context/eventing';
import { useFilterState } from '../../FilterModal/useFilterState';
// pwa-studio/packages/peregrine/lib/talons/FilterModal/useFilterState.js
//pwa-studio/packages/peregrine/lib/talons/RootComponents/FilterModal/useFilterState
import DEFAULT_OPERATIONS from './categoryContent.gql';
import { logMissingFieldErrors } from '@apollo/client/core/ObservableQuery';

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

    const [filterOptions, setFilterOptions] = useState();

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

    const { data: categoryData, loading: categoryLoading } = useQuery(
        getCategoryContentQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !categoryId,
            variables: {
                id: categoryId
            }
        }
    );

    const [, { dispatch }] = useEventingContext();

    useEffect(() => {
        let fashionColor = '';
        let fashionMaterial = '';
        let fashionSize = '';
        let fashionStyle = '';
        let hasVideo = '';
        let priceValue = {
            from: '',
            to: ''
        };
        let filterIteration = true;

        //{from: "40" to: "59"}

        if (filterOptions) {
            for (const [group, items] of filterOptions) {
                if (group === 'fashion_color') {
                    const [item] = items;
                    fashionColor = item.value;
                }
                if (group === 'fashion_material') {
                    const [item] = items;
                    fashionMaterial = item.value;
                }
                if (group === 'fashion_size') {
                    const [item] = items;
                    fashionSize = item.value;
                }
                if (group === 'fashion_style') {
                    const [item] = items;
                    fashionStyle = item.value;
                }

                if (group === 'has_video') {
                    const [item] = items;
                    hasVideo = item.value;
                }
                if (group === 'price') {
                    const [item] = items;
                    filterIteration = item;
                    const valueAdd = item?.value?.split('_');

                    if (valueAdd) {
                        priceValue.from = valueAdd[0];
                        priceValue.to = valueAdd[1];
                    }
                }
            }
        }

        if (categoryId && filterIteration) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    },
                    fashionColorFilter: {
                        eq: fashionColor
                    },
                    fashionMaterialFilter: {
                        eq: fashionMaterial
                    },
                    fashionSizeFilter: {
                        eq: fashionSize
                    },
                    fashionStyleFilter: {
                        eq: fashionStyle
                    },
                    hasVideoFilter: {
                        eq: hasVideo
                    },
                    fashionPriceFilter: priceValue
                }
            });
        }
    }, [categoryId, filterOptions, getFilters]);

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

    //console.log(filterData);
    const filters = filterData ? filterData.products.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;
    const totalCount = data ? data.products.total_count : null;
    const categoryName =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].name
            : null;
    const categoryDescription =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].description
            : null;
    const availableSortMethods = sortData
        ? sortData.products.sort_fields.options
        : null;

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
        filterOptions,
        setFilterOptions,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData
    };
};
