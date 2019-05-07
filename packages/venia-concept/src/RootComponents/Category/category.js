import React, { useEffect } from 'react';
import { string, number, shape } from 'prop-types';
import { useQuery } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import categoryQuery from 'src/queries/getCategory.graphql';
import CategoryContent from './categoryContent';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import defaultClasses from './category.css';

const Category = props => {
    const {
        id,
        currentPage,
        pageSize,
        prevPageTotal,
        setCurrentPage,
        setPrevPageTotal
    } = props;

    const pageControl = {
        currentPage: currentPage,
        setPage: setCurrentPage,
        updateTotalPages: setPrevPageTotal,
        totalPages: prevPageTotal
    };

    const [queryResult, queryApi] = useQuery(categoryQuery);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;
    const classes = mergeClasses(defaultClasses, props.classes);

    useEffect(() => {
        setLoading(true);
        runQuery({
            variables: {
                id: Number(id),
                onServer: false,
                pageSize: Number(pageSize),
                currentPage: Number(currentPage)
            }
        });
    }, [id, pageSize, currentPage, runQuery, setLoading]);

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);

    if (error) return <div>Data Fetch Error</div>;
    // If our pagination component has mounted, then we have
    // a total page count in the store, so we continue to render
    // with our last known total
    if (loading || !data)
        return pageControl.totalPages ? (
            <CategoryContent pageControl={pageControl} pageSize={pageSize} />
        ) : (
            loadingIndicator
        );

    // TODO: Retrieve the page total from GraphQL when ready
    const pageCount = data.category.products.total_count / pageSize;
    const totalPages = Math.ceil(pageCount);
    const totalWrapper = {
        ...pageControl,
        totalPages: totalPages
    };

    return (
        <CategoryContent
            classes={classes}
            pageControl={totalWrapper}
            data={data}
        />
    );
};

Category.propTypes = {
    id: number,
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    currentPage: number,
    pageSize: number,
    prevPageTotal: number
};

Category.defaultProps = {
    id: 3
};

export default Category;
