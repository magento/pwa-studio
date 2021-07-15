import React from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './breadcrumbs.css';

const BreadcrumbsShimmer = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Shimmer className={classes.root} width={400} height={15} aria-live="polite" aria-busy="true" />
    );
};

BreadcrumbsShimmer.defaultProps = {
    classes: {}
};

BreadcrumbsShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default BreadcrumbsShimmer;
