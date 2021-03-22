import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';

import CategoryContent from './categoryContent';
import defaultClasses from './category.css';
import { Meta } from '../../components/Head';
import { GET_PAGE_SIZE } from './category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

const Category = props => {
    const { id } = props;

    const talonProps = useCategory({
        id,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });

    const {
        error,
        metaDescription,
        loading,
        categoryData,
        pageControl,
        sortProps,
        pageSize
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    // Show the loading indicator until data has been fetched.
    if (!categoryData && loading) {
        return fullPageLoadingIndicator;
    }

    if (error && pageControl.currentPage === 1) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }

        return <ErrorView />;
    }

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            <CategoryContent
                categoryId={id}
                classes={classes}
                data={categoryData}
                pageControl={pageControl}
                sortProps={sortProps}
                pageSize={pageSize}
            />
        </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    id: number
};

Category.defaultProps = {
    id: 3
};

export default Category;
