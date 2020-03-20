import React from 'react';

import { displayStates, useShippingMethod } from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';

import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { doneEditing, onSave, showContent } = props;

    const talonProps = useShippingMethod({
        doneEditing,
        showContent
    });

    const { displayState } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let contents = null;
    if (displayState === displayStates.QUEUED) {
        contents = (
            <h2 className={classes.heading}>Shipping Method</h2>
        );
    }
    else if (displayState === displayStates.ACTIVE) {
        contents = (
            <>
                <span>Active!</span>
                <Button onClick={onSave} priority="normal">
                    {'Continue to Payment Information'}
                </Button>
            </>
        );
    }
    else if (displayState === displayStates.FINISHED) {
        contents = (
            <span>Finished & Editable!</span>
        );
    }

    return (
        <div className={classes.root}>
            { contents }
        </div>
    );
};

export default ShippingMethod;
