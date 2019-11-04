import React, { Fragment, useMemo } from 'react';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './breadcrumbs.css';

const URL_SUFFIX = '.html';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = ({ category_url_path }) => {
    if (category_url_path) {
        return resourceUrl(`/${category_url_path}${URL_SUFFIX}`);
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Breadcrumbs! Sorts and generates links for an array of breadcrumb data.
 *
 * @param {String} props.currentCategory name of the current category
 * @param {Array} props.data Breadcrumb data
 */
const Breadcrumbs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const data = props.data || [];

    const sortedData = useMemo(() => data.sort(sortCrumbs), [data]);

    const normalized = useMemo(
        () =>
            sortedData.map(category => ({
                text: category.category_name,
                path: getPath(category)
            })),
        [sortedData]
    );
    const divider = useMemo(() => <span className={classes.divider}>/</span>, [
        classes.divider
    ]);

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return normalized.map(({ text, path }) => {
            return (
                <Fragment key={text}>
                    {divider}
                    <Link className={classes.link} to={path}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.link, divider, normalized]);

    return (
        <div className={classes.root}>
            <Link className={classes.link} to="/">
                {'Home'}
            </Link>
            {links}
            {divider}
            <span className={classes.currentCategory}>
                {props.currentCategory}
            </span>
        </div>
    );
};

export default Breadcrumbs;
