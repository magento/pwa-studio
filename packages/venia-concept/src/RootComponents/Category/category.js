import React, { useEffect } from 'react';
import { number, shape, string } from 'prop-types';
import { usePagination, useQuery } from '@magento/peregrine';

import { toggleDrawer } from 'src/actions/app';
import catalogActions from 'src/actions/catalog';
import { mergeClasses } from 'src/classify';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { connect } from 'src/drivers';
import categoryQuery from 'src/queries/getCategory.graphql';
import isObjectEmpty from 'src/util/isObjectEmpty';
import { getFilterParams } from 'src/util/getFilterParamsFromUrl';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';

const Category = props => {
    const { filterClear, id, openDrawer, pageSize } = props;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        updateTotalPages: setTotalPages,
        totalPages
    };

    const [queryResult, queryApi] = useQuery(categoryQuery);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;
    const classes = mergeClasses(defaultClasses, props.classes);

    // clear any stale filters
    useEffect(() => {
        if (isObjectEmpty(getFilterParams())) {
            filterClear();
        }
    }, []);

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
    }, [currentPage, id, pageSize]);

    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
    }, [totalPagesFromData]);

    if (error) return <div>Data Fetch Error</div>;

    // show loading indicator until data has been fetched
    // and pagination state has been updated
    if (!totalPages) return loadingIndicator;

    return (
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
    pageSize: 6
};

const mapDispatchToProps = dispatch => ({
    filterClear: () => dispatch(catalogActions.filterOption.clear()),
    openDrawer: () => dispatch(toggleDrawer('filter'))
});

export default connect(
    null,
    mapDispatchToProps
)(Category);
