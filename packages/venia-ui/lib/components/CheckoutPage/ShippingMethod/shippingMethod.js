import React, { useMemo } from 'react';

import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';

import Done from './done';
import Editing from './editing';
import defaultClasses from './shippingMethod.css';

import {
    GET_SHIPPING_METHODS,
    GET_SELECTED_SHIPPING_METHOD,
    SET_SHIPPING_METHOD
} from './shippingMethod.gql';

const ShippingMethod = props => {
    const { onSave } = props;

    const talonProps = useShippingMethod({
        onSave,
        queries: {
            getShippingMethods: GET_SHIPPING_METHODS,
            getSelectedShippingMethod: GET_SELECTED_SHIPPING_METHOD
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
        isLoadingSelectedShippingMethod,
        selectedShippingMethod,
        shippingMethods,
        showEditMode
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const contentsMap = useMemo(
        () =>
            new Map()
                .set(
                    displayStates.EDITING,
                    <Editing
                        handleSubmit={handleSubmit}
                        hasShippingMethods={hasShippingMethods}
                        isLoading={
                            isLoadingSelectedShippingMethod ||
                            isLoadingShippingMethods
                        }
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                    />
                )
                .set(
                    displayStates.DONE,
                    <Done
                        isLoading={isLoadingSelectedShippingMethod}
                        showEditMode={showEditMode}
                    />
                ),
        [
            handleSubmit,
            hasShippingMethods,
            isLoadingShippingMethods,
            isLoadingSelectedShippingMethod,
            selectedShippingMethod,
            shippingMethods,
            showEditMode
        ]
    );
    const contents = contentsMap.get(displayState);

    return <div className={classes.root}>{contents}</div>;
};

export default ShippingMethod;
