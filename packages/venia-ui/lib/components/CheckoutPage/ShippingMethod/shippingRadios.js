import React from 'react';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import RadioGroup from '../../RadioGroup';
import ShippingRadio from '../../CartPage/PriceAdjustments/ShippingMethods/shippingRadio';
import defaultClasses from './shippingRadios.css';

const ShippingRadios = props => {
    const { isLoading, selectedShippingMethod, shippingMethods } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator classes={{ root: classes.loadingRoot }} />;
    }

    if (!shippingMethods.length) {
        return (
            <span className={classes.error}>
                {`Error loading shipping methods.
                Please ensure a shipping address is set and try again.`}
            </span>
        );
    }

    const shippingRadios = shippingMethods.map(method => {
        const label = (
            <ShippingRadio
                currency={method.amount.currency}
                name={method.method_title}
                price={method.amount.value}
            />
        );
        const value = method.serializedValue;

        return { label, value };
    });

    return (
        <RadioGroup
            classes={{
                message: classes.message,
                radio: classes.radio,
                radioLabel: classes.radioContents,
                root: classes.root
            }}
            field="shipping_method"
            initialValue={selectedShippingMethod}
            items={shippingRadios}
        />
    );
};

export default ShippingRadios;
