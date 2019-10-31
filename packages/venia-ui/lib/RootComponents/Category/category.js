import React, { useEffect } from 'react';
import { number, shape, string } from 'prop-types';
import { useLazyQuery } from '@apollo/react-hooks';
import { usePagination } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import GET_CATEGORY from '../../queries/getCategory.graphql';
import NoProductsFound from './NoProductsFound';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';

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

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        runQuery({
            variables: {
                currentPage: Number(currentPage),
                id: Number(id),
                idString: String(id),
                onServer: false,
                pageSize: Number(pageSize)
            }
        });

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, id, pageSize, runQuery]);

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

    return totalPagesFromData === 0 ? (
        <NoProductsFound categoryId={id} />
    ) : (
        <CategoryContent
            classes={classes}
            data={loading ? null : data}
            pageControl={pageControl}
        />
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
