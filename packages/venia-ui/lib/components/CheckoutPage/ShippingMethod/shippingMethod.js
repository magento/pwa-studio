import React, { useMemo } from 'react';

import { displayStates, useShippingMethod } from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';

import Done from './done';
import Editing from './editing';
import Queued from './queued';
import defaultClasses from './shippingMethod.css';

import { GET_SHIPPING_METHODS } from './shippingMethod.gql';

const ShippingMethod = props => {
    const { doneEditing, onSave, showContent } = props;

    const talonProps = useShippingMethod({
        doneEditing,
        showContent,
        queries: {
            getShippingMethods: GET_SHIPPING_METHODS
        }
    });

    const {
        didFailLoadingShippingMethods,
        displayState,
        isLoadingShippingMethods,
        selectedShippingMethod,
        shippingMethods
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const contentsMap = useMemo(() => new Map()
        .set(displayStates.QUEUED, <Queued />)
        .set(
            displayStates.EDITING,
            <Editing
                didFailLoadingShippingMethods={didFailLoadingShippingMethods}
                isLoadingShippingMethods={isLoadingShippingMethods}
                onSave={onSave}
                selectedShippingMethod={selectedShippingMethod}
                shippingMethods={shippingMethods}
            />
        )
        .set(displayStates.DONE, <Done />)
    , [onSave, selectedShippingMethod, shippingMethods]);
    const contents = contentsMap.get(displayState);

    return (
        <div className={classes.root}>
            { contents }
        </div>
    );
};

export default ShippingMethod;
