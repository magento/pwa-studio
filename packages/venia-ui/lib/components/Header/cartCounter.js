import React from 'react';
import { number, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './cartCounter.css';

const CartCounter = props => {
    const { numItems } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    // Don't show anything both when we don't have data to show, and when numItems is zero (0).
    if (!numItems) {
        return null;
    }

    return <span className={classes.root}>{numItems}</span>;
};

CartCounter.propTypes = {
    classes: shape({
        root: string
    }),
    numItems: number
};

export default CartCounter;
