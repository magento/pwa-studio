import React, { useMemo } from 'react';
import { arrayOf, bool, func, number, oneOf, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import ShippingRadios from './shippingRadios';
import defaultClasses from './editForm.css';

export const modes = {
    INITIAL: 'initial',
    UPDATE: 'update'
};

const EditForm = props => {
    const {
        handleCancel,
        handleSubmit,
        isLoading,
        mode,
        pageIsUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const buttons = useMemo(() => {
        if (mode === modes.INITIAL) {
            if (isLoading) return null;

            const continueDisabled = pageIsUpdating || !shippingMethods.length;

            return (
                <div className={classes.initialButtonContainer}>
                    <Button
                        priority="normal"
                        type="submit"
                        disabled={continueDisabled}
                    >
                        {'Continue to Payment Information'}
                    </Button>
                </div>
            );
        }

        if (mode === modes.UPDATE) {
            const updateDisabled = pageIsUpdating;

            return (
                <div className={classes.updateButtonContainer}>
                    <Button onClick={handleCancel}>{'Cancel'}</Button>
                    <Button
                        priority="high"
                        type="submit"
                        disabled={updateDisabled}
                    >
                        {'Update'}
                    </Button>
                </div>
            );
        }
    }, [
        classes,
        handleCancel,
        isLoading,
        mode,
        pageIsUpdating,
        shippingMethods.length
    ]);

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <ShippingRadios
                isLoading={isLoading}
                selectedShippingMethod={selectedShippingMethod}
                shippingMethods={shippingMethods}
            />
            {buttons}
        </Form>
    );
};

export default EditForm;

EditForm.propTypes = {
    handleCancel: func,
    handleSubmit: func,
    isLoading: bool,
    mode: oneOf(Object.values(modes)),
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
