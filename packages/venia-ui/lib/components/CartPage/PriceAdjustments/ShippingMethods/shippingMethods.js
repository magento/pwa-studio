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
    const { handleSubmit, shippingMethods } = useShippingMethods({
        getShippingMethodsQuery: GET_SHIPPING_METHODS
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <ShippingFields />
            <div className={classes.shipping_methods}>
                <h3 className={classes.prompt}>Shipping Methods</h3>
                <ShippingRadios shippingMethods={shippingMethods} />
            </div>
        </Form>
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
