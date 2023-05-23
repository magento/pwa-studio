import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';

import RadioGroup from '../../../RadioGroup';
import ShippingRadio from './shippingRadio';

import { useShippingRadios } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingRadios';
import { useStyle } from '../../../../classify';

import defaultClasses from './shippingRadios.module.css';

const ShippingRadios = props => {
    const { setIsCartUpdating, selectedShippingMethod, shippingMethods } = props;
    const { formattedShippingMethods, handleShippingSelection } = useShippingRadios({
        setIsCartUpdating,
        selectedShippingMethod,
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

    const classes = useStyle(defaultClasses, props.classes);
    const radioGroupClasses = {
        radioLabel: classes.radioContents,
        root: classes.radioRoot
    };

    return (
        <RadioGroup
            classes={radioGroupClasses}
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
        radioContents: string,
        radioRoot: string
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
