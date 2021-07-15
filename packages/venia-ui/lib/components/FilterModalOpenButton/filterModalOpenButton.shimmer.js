import React from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './filterModalOpenButton.css';

const FilterModalOpenButtonShimmer = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Shimmer
            className={classes.filterButton}
            width={125}
            height={45}
            aria-live="polite"
            aria-busy="true"
        />
    );
};

FilterModalOpenButtonShimmer.defaultProps = {
    classes: {}
};

FilterModalOpenButtonShimmer.propTypes = {
    classes: shape({
        filterButton: string
    })
};

export default FilterModalOpenButtonShimmer;
