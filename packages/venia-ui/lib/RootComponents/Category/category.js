import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { mergeClasses } from '../../classify';
import { Meta } from '../../components/Head';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';

const Category = props => {
    const { id, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useCategory({ id, pageSize });
    const {
        data,
        error,
        loading,
        pageControl,
        sortProps,
        totalPagesFromData
    } = talonProps;
    const { currentPage } = pageControl;

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

    const metaDescription =
        data && data.category && data.category.meta_description
            ? data.category.meta_description
            : '';

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            <CategoryContent
                categoryId={id}
                classes={classes}
                data={loading ? null : data}
                pageControl={pageControl}
                sortProps={sortProps}
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
