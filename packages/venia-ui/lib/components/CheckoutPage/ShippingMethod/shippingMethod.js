import React from 'react';
import { func } from 'prop-types';

import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';

import Done from './done';
import EditForm, { modes as editFormModes } from './editForm';
import UpdateModal from './updateModal';

import defaultClasses from './shippingMethod.css';

import {
    GET_SHIPPING_METHODS,
    GET_SELECTED_SHIPPING_METHOD,
    SET_SHIPPING_METHOD
} from './shippingMethod.gql';

const ShippingMethod = props => {
    const { onSave, pageIsUpdating, setPageIsUpdating } = props;

    const talonProps = useShippingMethod({
        mutations: {
            setShippingMethod: SET_SHIPPING_METHOD
        },
        onSave,
        queries: {
            getShippingMethods: GET_SHIPPING_METHODS,
            getSelectedShippingMethod: GET_SELECTED_SHIPPING_METHOD
        },
        setPageIsUpdating
    });

    const {
        displayState,
        handleCancelUpdate,
        handleSubmit,
        isLoadingShippingMethods,
        isLoadingSelectedShippingMethod,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let contents;
    switch (displayState) {
        case displayStates.EDITING:
            {
                contents = (
                    <div className={classes.root}>
                        <div className={classes.editingBody}>
                            <h3 className={classes.editingHeading}>
                                {'Shipping Method'}
                            </h3>
                            <EditForm
                                handleSubmit={handleSubmit}
                                isLoading={
                                    isLoadingSelectedShippingMethod ||
                                    isLoadingShippingMethods
                                }
                                mode={editFormModes.INITIAL}
                                pageIsUpdating={pageIsUpdating}
                                selectedShippingMethod={selectedShippingMethod}
                                shippingMethods={shippingMethods}
                            />
                        </div>
                    </div>
                );
            }
            break;

        case displayStates.DONE:
        default: {
            contents = (
                <div className={classes.done}>
                    <Done
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                        showUpdateMode={showUpdateMode}
                    />
                </div>
            );
        }
    }

    return (
        <>
            {contents}
            <UpdateModal
                handleCancelUpdate={handleCancelUpdate}
                handleSubmit={handleSubmit}
                isOpen={isUpdateMode}
                pageIsUpdating={pageIsUpdating}
                selectedShippingMethod={selectedShippingMethod}
                shippingMethods={shippingMethods}
            />
        </>
    );
};

ShippingMethod.propTypes = {
    onSave: func.isRequired
};

export default ShippingMethod;
