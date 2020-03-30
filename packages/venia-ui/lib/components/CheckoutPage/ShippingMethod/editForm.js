import React, { useMemo } from 'react';
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
        handleCancelUpdate,
        handleSubmit,
        isLoading,
        mode,
        pageIsUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;

    const initialButtonDisabled = pageIsUpdating || !shippingMethods.length;
    const classes = mergeClasses(defaultClasses, props.classes);

    const buttons = useMemo(() => {
        if (mode === modes.INITIAL) {
            if (isLoading) return null;

            return (
                <div className={classes.initialButtonContainer}>
                    <Button
                        priority="normal"
                        type="submit"
                        disabled={initialButtonDisabled}
                    >
                        {'Continue to Payment Information'}
                    </Button>
                </div>
            );
        }

        if (mode === modes.UPDATE) {
            return (
                <div className={classes.updateButtonContainer}>
                    <Button onClick={handleCancelUpdate}>{'Cancel'}</Button>
                    <Button priority="high" type="submit">
                        {'Update'}
                    </Button>
                </div>
            );
        }
    }, [classes, handleCancelUpdate, initialButtonDisabled, isLoading, mode]);

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
