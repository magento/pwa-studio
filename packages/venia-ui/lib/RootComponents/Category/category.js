import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { number, shape, string } from 'prop-types';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { usePagination } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';

import CategoryContent from './categoryContent';
import defaultClasses from './category.css';
import { Meta } from '../../components/Head';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

import GET_CATEGORY from '../../queries/getCategory.graphql';
import FILTER_INTROSPECTION from '../../queries/introspection/filterIntrospectionQuery.graphql';

const Category = props => {
    const { id, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const [sort, setSort] = useState({
        sortAttribute: 'relevance',
        sortDirection: 'DESC'
    });
    const { sortAttribute, sortDirection } = sort;
    const sortControl = {
        currentSort: sort,
        setSort: setSort
    };

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_CATEGORY);
    const { loading, error, data } = queryResponse;
    const { search } = useLocation();

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const { data: introspectionData, error: introspectionError } = useQuery(
        FILTER_INTROSPECTION
    );

    useEffect(() => {
        if (introspectionError) {
            console.error(introspectionError);
        }
    }, [introspectionError]);

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // Use the category id for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        newFilters['category_id'] = { eq: String(id) };

        runQuery({
            variables: {
                currentPage: Number(currentPage),
                id: Number(id),
                filters: newFilters,
                onServer: false,
                pageSize: Number(pageSize),
                sort: { [String(sortAttribute)]: String(sortDirection) }
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [
        currentPage,
        filterTypeMap,
        id,
        pageSize,
        runQuery,
        search,
        sortAttribute,
        sortDirection
    ]);

    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    // Reset the current page back to one (1) when the search string or filters
    // change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (prevSearch.toString() != nextSearch.toString()) {
            // The search term changed.
            setCurrentPage(1);
            // And update the ref.
            previousSearch.current = search;
        }
    }, [previousSearch, search, setCurrentPage]);

    if (error && currentPage === 1 && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    // Show the loading indicator until data has been fetched.
    if (totalPagesFromData === null) {
        return fullPageLoadingIndicator;
    }

    return (
        <>
            <Meta
                name="description"
                content={
                    data && data.category && data.category.meta_description
                }
            />
            <CategoryContent
                categoryId={id}
                classes={classes}
                data={loading ? null : data}
                pageControl={pageControl}
                sortControl={sortControl}
            />
        </>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    id: number,
    pageSize: number
};

Category.defaultProps = {
    id: 3,
    // TODO: This can be replaced by the value from `storeConfig when the PR,
    // https://github.com/magento/graphql-ce/pull/650, is released.
    pageSize: 6
};

export default Category;
