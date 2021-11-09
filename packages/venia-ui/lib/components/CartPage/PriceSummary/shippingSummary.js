import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../classify';
/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const ShippingSummary = props => {
    const classes = useStyle({}, props.classes);
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
            <span
                data-cy="ShippingSummary-shippingValue"
                className={classes.price}
            >
                {price}
            </span>
        </>
    );
};

export default ShippingSummary;
