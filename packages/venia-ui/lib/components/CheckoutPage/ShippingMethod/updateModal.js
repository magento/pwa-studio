import React from 'react';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import Dialog from '../../Dialog';
import FormError from '../../FormError';
import ShippingRadios from './shippingRadios';
import defaultClasses from './updateModal.css';

const UpdateModal = props => {
    const {
        classes: propClasses,
        formErrors,
        formInitialValues,
        handleCancel,
        handleSubmit,
        isLoading,
        isOpen,
        pageIsUpdating,
        shippingMethods
    } = props;

    const dialogButtonsDisabled = pageIsUpdating;
    const dialogSubmitButtonDisabled = isLoading;
    const dialogFormProps = {
        initialValues: formInitialValues
    };

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <Dialog
            confirmText={'Update'}
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleSubmit}
            shouldDisableAllButtons={dialogButtonsDisabled}
            shouldDisableConfirmButton={dialogSubmitButtonDisabled}
            title={'Edit Shipping Method'}
        >
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={formErrors}
            />
            <ShippingRadios
                disabled={dialogButtonsDisabled}
                shippingMethods={shippingMethods}
            />
        </Dialog>
    );
};

export default UpdateModal;

UpdateModal.propTypes = {
    formInitialValues: object,
    handleCancel: func,
    handleSubmit: func,
    isLoading: bool,
    isOpen: bool,
    pageIsUpdating: bool,
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
