import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './orderHistoryPage.css';

const OrderHistoryPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h1 className={classes.heading}>Order History</h1>
        </div>
    );
};

export default OrderHistoryPage;
