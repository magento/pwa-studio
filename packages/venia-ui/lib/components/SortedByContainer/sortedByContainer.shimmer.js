import React from 'react';
import { shape, string } from 'prop-types';
import {mergeClasses} from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './sortedByContainer.css'

const SortedByContainerShimmer = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Shimmer className={classes.root} height={15} />
    )
};

SortedByContainerShimmer.defaultProps = {
    classes: {}
};

SortedByContainerShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default SortedByContainerShimmer;
