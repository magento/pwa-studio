import React from 'react';
import { Form } from 'informed';
import { func, number, string } from 'prop-types';
import QuantityStepper from '../../QuantityStepper';

const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityStepper {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func,
    message: string
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

/**
 * @deprecated - moved to component directory in 12.4.0
 * @see QuantityStepper
 */
export const QuantityFields = QuantityStepper;

export default Quantity;
