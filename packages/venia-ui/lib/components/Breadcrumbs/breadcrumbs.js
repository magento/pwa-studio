import React, { Fragment, useMemo } from 'react';
import { number, string } from 'prop-types';
import { Link, resourceUrl } from '@magento/venia-drivers';

import { useBreadcrumbs } from '@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs';
import GET_BREADCRUMB_DATA from '../../queries/getBreadcrumbData.graphql';
import { mergeClasses } from '../../classify';
import defaultClasses from './breadcrumbs.css';

/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the id of the category for which to generate breadcrumbs
 * @param {String} props.currentProduct the name of the product we're currently on, if any.
 */
const Breadcrumbs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { categoryId, currentProduct } = props;

    const talonProps = useBreadcrumbs({
        categoryId,
        query: GET_BREADCRUMB_DATA
    });

    const {
        currentCategory,
        currentCategoryPath,
        hasError,
        isLoading,
        normalizedData
    } = talonProps;

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return normalizedData.map(({ text, path }) => {
            return (
                <Fragment key={text}>
                    <span className={classes.divider}>/</span>
                    <Link className={classes.link} to={resourceUrl(path)}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.divider, classes.link, normalizedData]);

    // Don't display anything but the empty, static height div when loading or
    // if there was an error.
    if (isLoading || hasError) {
        return <div className={classes.root} />;
    }

    // If we have a "currentProduct" it means we're on a PDP so we want the last
    // category text to be a link. If we don't have a "currentProduct" we're on
    // a category page so it should be regular text.
    const currentCategoryLink = currentProduct ? (
        <Link className={classes.link} to={resourceUrl(currentCategoryPath)}>
            {currentCategory}
        </Link>
    ) : (
        <span className={classes.currentCategory}>{currentCategory}</span>
    );

    const currentProductNode = currentProduct ? (
        <Fragment>
            <span className={classes.divider}>/</span>
            <span className={classes.text}>{currentProduct}</span>
        </Fragment>
    ) : null;

    return (
        <div className={classes.root}>
            <Link className={classes.link} to="/">
                {'Home'}
            </Link>
            {links}
            <span className={classes.divider}>/</span>
            {currentCategoryLink}
            {currentProductNode}
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    categoryId: number.isRequired,
    currentProduct: string
};
