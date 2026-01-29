import React, { Fragment, useMemo } from 'react';
import { shape, string } from 'prop-types';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import { useStyle } from '../../classify';

import CategoryContent from './categoryContent';
import defaultClasses from './category.module.css';
import { Meta, Link } from '../../components/Head';
import { GET_PAGE_SIZE } from './category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { useIntl } from 'react-intl';

const MESSAGES = new Map().set(
    'NOT_FOUND',
    "Looks like the category you were hoping to find doesn't exist. Sorry about that."
);

const Category = props => {
    const { uid } = props;
    const { formatMessage } = useIntl();

    const talonProps = useCategory({
        id: uid,
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
        pageSize,
        categoryNotFound,
        storeConfig
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    // Generate canonical URL for category
    const canonicalUrl = useMemo(() => {
        if (!categoryData || !storeConfig?.category_canonical_tag) return null;

        const category = categoryData.categories?.items?.[0];
        if (!category) return null;

        // Use url_path if available, otherwise fall back to url_key
        const urlPath = category.url_path || category.url_key;
        if (!urlPath) return null;

        const origin =
            typeof window !== 'undefined' ? window.location.origin : '';
        const suffix = storeConfig?.category_url_suffix || '';

        return `${origin}/${urlPath}${suffix}`;
    }, [categoryData, storeConfig]);

    if (!categoryData) {
        if (error && pageControl.currentPage === 1) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }
    if (categoryNotFound) {
        return (
            <ErrorView
                message={formatMessage({
                    id: 'category.notFound',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            {canonicalUrl && <Link rel="canonical" href={canonicalUrl} />}
            <CategoryContent
                categoryId={uid}
                classes={classes}
                data={categoryData}
                isLoading={loading}
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
    uid: string
};

Category.defaultProps = {
    uid: 'Mg=='
};

export default Category;
