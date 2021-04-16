import { useCallback, useEffect, useState, useRef } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import { useAppContext } from '../../../context/app';

import DEFAULT_OPERATIONS from './categoryContent.gql';
import { useFilterState } from '../../FilterModal';

const DRAWER_NAME = 'filter';

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {number} result.categoryId - This category's ID.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {func}   result.handleLoadFilters - A callback function to signal the user's intent to interact with the filters.
 * @returns {func}   result.handleOpenFilters - A callback function that actually opens the filter drawer.
 * @returns {object} result.items - The items in this category.
 * @returns {bool}   result.loadFilters - Whether or not the user has signalled their intent to interact with the filters.
 */
export const useCategoryContent = props => {
    const { categoryId, data, pageSize = 6 } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getCategoryContentQuery,
        getProductFiltersByCategoryQuery
    } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);
    const [loadFilters, setLoadFilters] = useState(false);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [filterState] = useFilterState();
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const prevDrawer = useRef(null);

    const handleLoadFilters = useCallback(() => {
        setLoadFilters(true);
    }, [setLoadFilters]);

    const handleOpenFilters = useCallback(() => {
        setShowFiltersModal(true);
        toggleDrawer(DRAWER_NAME);
    }, [setShowFiltersModal, toggleDrawer]);

    const handleCloseFilters = useCallback(() => {
        setShowFiltersModal(false);
        closeDrawer(DRAWER_NAME);
    }, [setShowFiltersModal, closeDrawer]);

    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
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

    // Focus for the button that opens filters should be set
    // when filters just applied and filters drawer just closed
    useEffect(() => {
        prevDrawer.current = drawer;
    }, [drawer, filterState]);

    const filters = filterData ? filterData.products.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;
    const categoryName = categoryData ? categoryData.category.name : null;
    const categoryDescription = categoryData
        ? categoryData.category.description
        : null;

    return {
        categoryName,
        categoryDescription,
        filters,
        showFiltersModal,
        handleLoadFilters,
        handleOpenFilters,
        handleCloseFilters,
        items,
        loadFilters,
        totalPagesFromData
    };
};
