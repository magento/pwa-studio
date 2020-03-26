import React, { useMemo } from 'react';
import { func } from 'prop-types';

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
    const { onSave, pageIsUpdating, setIsUpdating } = props;

    const talonProps = useShippingMethod({
        mutations: {
            setShippingMethod: SET_SHIPPING_METHOD
        },
        onSave,
        queries: {
            getShippingMethods: GET_SHIPPING_METHODS,
            getSelectedShippingMethod: GET_SELECTED_SHIPPING_METHOD
        },
        setIsUpdating
    });

    const {
        displayState,
        handleSubmit,
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
                        isLoading={
                            isLoadingSelectedShippingMethod ||
                            isLoadingShippingMethods
                        }
                        pageIsUpdating={pageIsUpdating}
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                    />
                )
                .set(
                    displayStates.DONE,
                    <Done
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                        showEditMode={showEditMode}
                    />
                ),
        [
            handleSubmit,
            isLoadingShippingMethods,
            isLoadingSelectedShippingMethod,
            pageIsUpdating,
            selectedShippingMethod,
            shippingMethods,
            showEditMode
        ]
    );

    const containerClass =
        displayState === displayStates.EDITING ? classes.root : classes.done;
    const contents = contentsMap.get(displayState);

    return <div className={containerClass}>{contents}</div>;
};

ShippingMethod.propTypes = {
    onSave: func.isRequired
};

export default ShippingMethod;
