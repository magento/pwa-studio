import React from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';

import Dialog from '../../Dialog';
import ShippingRadios from './shippingRadios';

const UpdateModal = props => {
    const {
        handleCancel,
        handleSubmit,
        isLoading,
        isOpen,
        pageIsUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;

    return (
        <Dialog
            confirmText={'Update'}
            onCancel={handleCancel}
            onConfirm={handleSubmit}
            isOpen={isOpen}
            shouldDisableButtons={pageIsUpdating}
            title={'Edit Shipping Method'}
        >
            <ShippingRadios
                isLoading={isLoading}
                selectedShippingMethod={selectedShippingMethod}
                shippingMethods={shippingMethods}
            />
        </Dialog>
    );
};

export default UpdateModal;

UpdateModal.propTypes = {
    handleCancel: func,
    handleSubmit: func,
    isLoading: bool,
    isOpen: bool,
    pageIsUpdating: bool,
    selectedShippingMethod: string,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    )
};
