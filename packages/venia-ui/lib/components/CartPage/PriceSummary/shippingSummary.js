import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { gql } from '@apollo/client';
import Price from '@magento/venia-ui/lib/components/Price';

import { mergeClasses } from '../../../classify';
/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const ShippingSummary = props => {
    const classes = mergeClasses({}, props.classes);
    const { data, isCheckout } = props;
    const { formatMessage } = useIntl();

    // Don't render estimated shipping until an address has been provided and
    // a method has been selected.
    if (!data.length || !data[0].selected_shipping_method) {
        return null;
    }

    const shipping = data[0].selected_shipping_method.amount;

    const shippingLabel = isCheckout
        ? formatMessage({
              id: 'shippingSummary.shipping',
              defaultMessage: 'Shipping'
          })
        : formatMessage({
              id: 'shippingSummary.estimatedShipping',
              defaultMessage: 'Estimated Shipping'
          });

    // For a value of "0", display "FREE".
    const price = shipping.value ? (
        <Price value={shipping.value} currencyCode={shipping.currency} />
    ) : (
        <span>
            <FormattedMessage id={'global.free'} defaultMessage={'FREE'} />
        </span>
    );

    return (
        <>
            <span className={classes.lineItemLabel}>{shippingLabel}</span>
            <span className={classes.price}>{price}</span>
        </>
    );
};

export const ShippingSummaryFragment = gql`
    fragment ShippingSummaryFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                amount {
                    currency
                    value
                }
            }
            street
        }
    }
`;

export default ShippingSummary;
