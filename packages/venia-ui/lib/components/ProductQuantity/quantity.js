import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Select from '../Select';
import mockData from './mockData';
import defaultClasses from './quantity.css';

const Quantity = props => {
    const { classes: propClasses, selectLabel, ...restProps } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <Select
                {...restProps}
                field="quantity"
                aria-label={selectLabel}
                items={mockData}
            />
        </div>
    );
};
Quantity.propTypes = {
    classes: shape({
        root: string
    }),
    items: arrayOf(
        shape({
            value: number
        })
    )
};

Quantity.defaultProps = {
    selectLabel: "product's quantity"
};

export default Quantity;
