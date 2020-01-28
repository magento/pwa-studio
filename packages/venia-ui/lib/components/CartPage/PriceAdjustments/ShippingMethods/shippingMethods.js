import React from 'react';
import gql from 'graphql-tag';
import { Form } from 'informed';

import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';

import { mergeClasses } from '../../../../classify';

import { ShippingMethodsFragment } from './shippingMethodsFragments';
import defaultClasses from './shippingMethods.css';
import ShippingRadios from './shippingRadios';
import ShippingFields from './shippingFields';

const ShippingMethods = props => {
    const {
        isLoading,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods
    } = useShippingMethods({
        getShippingMethodsQuery: GET_SHIPPING_METHODS
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return !isLoading ? (
        <Form className={classes.root}>
            <ShippingFields selectedShippingFields={selectedShippingFields} />
            {shippingMethods.length ? (
                <div className={`${classes.shipping_methods}`}>
                    <h3 className={classes.prompt}>Shipping Methods</h3>
                    <ShippingRadios
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                    />
                </div>
            ) : null}
        </Form>
    ) : (
        <span>Loading Shipping Data...</span>
    );
};

export default ShippingMethods;

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            ...ShippingMethodsFragment
        }
    }
    ${ShippingMethodsFragment}
`;
