import React, { Fragment, useMemo } from 'react';
import { number } from 'prop-types';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './breadcrumbs.css';
import { useBreadcrumbs } from '../../../../peregrine/lib/talons/Breadcrumbs/useBreadcrumbs';
import GET_BREADCRUMB_DATA from '../../queries/getBreadcrumbData.graphql';

/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the id of the category for which to generate breadcrumbs
 */
const Breadcrumbs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { categoryId } = props;

    const talonProps = useBreadcrumbs({
        categoryId,
        query: GET_BREADCRUMB_DATA
    });

    const { currentCategory, isLoading, normalizedData } = talonProps;

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

    // Don't display anything but the empty, static height div when loading.
    if (isLoading) {
        return <div className={classes.root} />;
    }

    return (
        <div className={classes.root}>
            <Link className={classes.link} to="/">
                {'Home'}
            </Link>
            {links}
            <span className={classes.divider}>/</span>
            <span className={classes.currentCategory}>{currentCategory}</span>
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    categoryId: number.isRequired
};
