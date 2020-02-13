import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { number, shape, string } from 'prop-types';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { usePagination } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import GET_CATEGORY from '../../queries/getCategory.graphql';
import NoProductsFound from './NoProductsFound';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';
import { Meta } from '../../components/Head';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';
import gql from 'graphql-tag';
import { getFilterInput } from '../../util/getFilterInput';

const FilterIntrospectionQuery = gql`
    query getFilterInputs {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

const Category = props => {
    const { id, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_CATEGORY);
    const { loading, error, data } = queryResponse;
    const { search } = useLocation();
    // Get "allowed" filters by intersection of schema and aggregations
    const { data: introspectionData, error: introspectionError } = useQuery(
        FilterIntrospectionQuery
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
            console.log('Appling filter', key, 'with value', values);
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // TODO: Category filtering on a category page is weird. How should we handle it? Currently if we don't have a filter, as in navigated from Home, we will just use the default category. If a user then filters by category, should we overwrite the category page category? It would be possible to be on the "Bottoms" category page but filter for "Tops", and see tops, but have nothing else on the page change ie breadcrumbs, etc.
        if (!filters.get('category_id')) {
            newFilters['category_id'] = { eq: String(id) };
        }

        runQuery({
            variables: {
                currentPage: Number(currentPage),
                id: Number(id),
                filters: newFilters,
                onServer: false,
                pageSize: Number(pageSize)
            }
        });

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, filterTypeMap, id, pageSize, runQuery, search]);

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

    const content =
        totalPagesFromData === 0 ? (
            <NoProductsFound categoryId={id} />
        ) : (
            <CategoryContent
                classes={classes}
                data={loading ? null : data}
                pageControl={pageControl}
            />
        );

    return (
        <>
            <Meta
                name="description"
                content={
                    data && data.category && data.category.meta_description
                }
            />
            {content}
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
