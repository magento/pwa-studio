import React from 'react';
import PriceSummary from '../../CartPage/PriceSummary';
import { mergeClasses } from '../../../classify';

import defaultClasses from './orderSummary.css';

const OrderSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>{'Order Summary'}</h1>
            <PriceSummary isUpdating={props.isUpdating} />
        </div>
    );
};

export default OrderSummary;
