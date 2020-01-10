import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';

/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const ShippingSummary = props => {
    const { classes, data } = props;
    const { shipping_addresses } = data.cart;

    // Don't render estimated shipping until an address has been provided and
    // a method has been selected.
    if (
        !shipping_addresses.length ||
        !shipping_addresses[0].selected_shipping_method
    ) {
        return null;
    }

    const shipping = shipping_addresses[0].selected_shipping_method.amount;

    // For a value of "0", display "FREE".
    const price = shipping.value ? (
        <Price value={shipping.value} currencyCode={shipping.currency} />
    ) : (
        <span>{'FREE'}</span>
    );

    return (
        <>
            <span className={classes.lineItemLabel}>
                {'Estimated Shipping'}
            </span>
            <span className={classes.price}>{price}</span>
        </>
    );
};

ShippingSummary.fragment = gql`
    fragment _ on Cart {
        shipping_addresses {
            selected_shipping_method {
                amount {
                    currency
                    value
                }
            }
        }
    }
`;

export default ShippingSummary;
