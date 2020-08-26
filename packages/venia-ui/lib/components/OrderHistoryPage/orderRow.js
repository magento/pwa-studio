import React from 'react';
import { mergeClasses } from '../../classify';

import defaultClasses from './orderRow.css';

const OrderRow = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return <li className={classes.root}>Order Row</li>;
};

export default OrderRow;
