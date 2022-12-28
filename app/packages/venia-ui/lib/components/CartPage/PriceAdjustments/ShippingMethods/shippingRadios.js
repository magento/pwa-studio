import React from 'react';
import { gql } from '@apollo/client';
import { arrayOf, number, shape, string } from 'prop-types';
import { useShippingRadios } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingRadios';

import { useStyle } from '../../../../classify';
import RadioGroup from '../../../RadioGroup';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import ShippingRadio from './shippingRadio';
import defaultClasses from './shippingRadios.module.css';
import { SelectedShippingMethodCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';

const ShippingRadios = props => {
    const {
        setIsCartUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;
    const {
        formattedShippingMethods,
        handleShippingSelection
    } = useShippingRadios({
        setIsCartUpdating,
        selectedShippingMethod,
        shippingMethods,
        mutations: {
            setShippingMethodMutation: SET_SHIPPING_METHOD_MUTATION
        }
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

export const SET_SHIPPING_METHOD_MUTATION = gql`
    mutation SetShippingMethodForEstimate(
        $cartId: String!
        $shippingMethod: ShippingMethodInput!
    ) {
        setShippingMethodsOnCart(
            input: { cart_id: $cartId, shipping_methods: [$shippingMethod] }
        ) {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...CartPageFragment
                ...SelectedShippingMethodCartFragment
                # Intentionally do not re-fetch available shipping methods because
                #  a) they are wrong in the mutation response
                #  b) it is expensive to recalculate.
            }
        }
    }
    ${CartPageFragment}
    ${SelectedShippingMethodCartFragment}
`;

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
