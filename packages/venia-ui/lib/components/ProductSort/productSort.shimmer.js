import React from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './productSort.css';

const ProductSortShimmer = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer className={classes.sortButton} width={125} height={45} />
        </div>
    );
};

ProductSortShimmer.defaultProps = {
    classes: {}
};

ProductSortShimmer.propTypes = {
    classes: shape({
        root: string,
        sortButton: string
    })
};

export default ProductSortShimmer;
