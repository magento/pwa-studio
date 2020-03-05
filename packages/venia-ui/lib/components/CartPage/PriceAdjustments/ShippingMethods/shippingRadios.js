import React from 'react';
import { arrayOf, string, shape, number } from 'prop-types';
import { useShippingRadios } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingRadios';

import { mergeClasses } from '../../../../classify';
import RadioGroup from '../../../RadioGroup';
import ShippingRadio from './shippingRadio';
import defaultClasses from './shippingRadios.css';
import { SET_SHIPPING_METHOD_MUTATION } from './shippingRadios.graphql';

const ShippingRadios = props => {
    const { selectedShippingMethod, shippingMethods } = props;
    const {
        formattedShippingMethods,
        handleShippingSelection
    } = useShippingRadios({
        selectedShippingMethod,
        setShippingMethodMutation: SET_SHIPPING_METHOD_MUTATION,
        shippingMethods
    });
    const radioComponents = formattedShippingMethods.map(shippingMethod => {
        return {
            label: (
                <ShippingRadio
                    currency={shippingMethod.amount.currency}
                    name={shippingMethod.method_title}
                    price={shippingMethod.amount.value}
                />
            ),
            value: shippingMethod.serializedValue
        };
    });
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <RadioGroup
            classes={{
                radio: classes.radio,
                radioLabel: classes.radio_contents,
                root: classes.root
            }}
            field="method"
            initialValue={selectedShippingMethod}
            items={radioComponents}
            onValueChange={handleShippingSelection}
        />
    );
};

export default ShippingRadios;

ShippingRadios.propTypes = {
    classes: shape({
        radio: string,
        radio_contents: string,
        root: string
    }),
    selectedShippingMethod: string,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string.isRequired,
                value: number.isRequired
            }),
            carrier_code: string.isRequired,
            method_code: string.isRequired,
            method_title: string.isRequired
        })
    )
};
