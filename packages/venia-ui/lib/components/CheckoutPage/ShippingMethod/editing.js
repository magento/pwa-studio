import React from 'react';
import { Form } from 'informed';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import ShippingRadios from './shippingRadios';
import defaultClasses from './editing.css';

const Editing = props => {
    const { didFailLoadingShippingMethods, isLoadingShippingMethods, onSave, selectedShippingMethod, shippingMethods } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.heading}>Shipping Method</h3>
            <Form>
                <ShippingRadios
                    didFailLoadingShippingMethods={didFailLoadingShippingMethods}
                    isLoadingShippingMethods={isLoadingShippingMethods}
                    selectedShippingMethod={selectedShippingMethod}
                    shippingMethods={shippingMethods}
                />
            </Form>
            <Button onClick={onSave} priority="normal">
                {'Continue to Payment Information'}
            </Button>
        </div>
    );
};

export default Editing;
