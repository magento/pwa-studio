import React, { Component } from 'react';
import { number, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './cartCounter.css';

const CartCounter = props => {
    const { counter } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    // Don't show anything both when we don't have data to show, and when the counter is zero (0).
    if (!counter) {
        return null;
    }

    return <span className={classes.root}>{counter}</span>;
};

CartCounter.propTypes = {
    classes: shape({
        root: string
    }),
    counter: number
};

export default CartCounter;
