import React, { useEffect } from 'react';
import { number, shape, string } from 'prop-types';
import { usePagination, useQuery } from '@magento/peregrine';

import { toggleDrawer } from 'src/actions/app';
import catalogActions from 'src/actions/catalog';
import { mergeClasses } from 'src/classify';

import { fullPageLoadingIndicator } from 'src/components/LoadingIndicator';
import { connect, withRouter } from 'src/drivers';
import { compose } from 'redux';
import categoryQuery from 'src/queries/getCategory.graphql';
import isObjectEmpty from 'src/util/isObjectEmpty';
import { getFilterParams } from 'src/util/getFilterParamsFromUrl';
import NoProductsFound from './NoProductsFound';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';

const Category = props => {
    const { filterClear, id, openDrawer, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const [paginationValues, paginationApi] = usePagination({
        history: props.history,
        location: props.location
    });

    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [queryResult, queryApi] = useQuery(categoryQuery);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    // clear any stale filters
    useEffect(() => {
        if (isObjectEmpty(getFilterParams())) {
            filterClear();
        }
    }, [filterClear]);

    // run the category query
    useEffect(() => {
        setLoading(true);
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
    }, [currentPage, id, pageSize, runQuery, setLoading]);

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
        return <div>Data Fetch Error</div>;
    }

    // Show the loading indicator until data has been fetched.
    if (!totalPagesFromData && totalPagesFromData !== 0) {
        return fullPageLoadingIndicator;
    }

    return totalPagesFromData === 0 ? (
        <NoProductsFound categoryName={data.category.name} />
    ) : (
        <CategoryContent
            classes={classes}
            data={loading ? null : data}
            filterClear={filterClear}
            openDrawer={openDrawer}
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

const mapDispatchToProps = dispatch => ({
    filterClear: () => dispatch(catalogActions.filterOption.clear()),
    openDrawer: () => dispatch(toggleDrawer('filter'))
});

export default compose(
    withRouter,
    connect(
        null,
        mapDispatchToProps
    )
)(Category);
