import React from 'react';

import { useFree } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useFree';

import { mergeClasses } from '../../../classify';

import freeComponentOperations from './free.gql';

import defaultClasses from './free.css';

const Free = props => {
    const { classes: propClasses, onSuccess, shouldSubmit } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    useFree({ onSuccess, shouldSubmit, ...freeComponentOperations });

    return (
        <div className={classes.root}>
            <h5 className={classes.heading}>Payment Information</h5>
            <div className={classes.body}>
                No payment required at this moment
            </div>
        </div>
    );
};

export default Free;
