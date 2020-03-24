import React, { useMemo } from 'react';

import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';

import Done from './done';
import Editing from './editing';
import Queued from './queued';
import defaultClasses from './shippingMethod.css';

import {
    GET_SHIPPING_METHODS,
    SET_SHIPPING_METHOD
} from './shippingMethod.gql';

const ShippingMethod = props => {
    const { doneEditing, onSave, showContent } = props;

    const talonProps = useShippingMethod({
        doneEditing,
        onSave,
        showContent,
        queries: {
            getShippingMethods: GET_SHIPPING_METHODS
        },
        mutations: {
            setShippingMethod: SET_SHIPPING_METHOD
        }
    });

    const {
        displayState,
        handleSubmit,
        hasShippingMethods,
        isLoadingShippingMethods,
        selectedShippingMethod,
        shippingMethods
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const contentsMap = useMemo(
        () =>
            new Map()
                .set(displayStates.QUEUED, <Queued />)
                .set(
                    displayStates.EDITING,
                    <Editing
                        handleSubmit={handleSubmit}
                        hasShippingMethods={hasShippingMethods}
                        isLoadingShippingMethods={isLoadingShippingMethods}
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                    />
                )
                .set(displayStates.DONE, <Done />),
        [
            handleSubmit,
            hasShippingMethods,
            isLoadingShippingMethods,
            selectedShippingMethod,
            shippingMethods
        ]
    );
    const contents = contentsMap.get(displayState);

    return <div className={classes.root}>{contents}</div>;
};

export default ShippingMethod;
