import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

/**
 * A component that renders the gift options summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
export default props => {
    const classes = useStyle({}, props.classes);
    const giftOptions = props?.data?.printed_card || {};

    if (!giftOptions || !giftOptions.value) {
        return null;
    }

    return (
        <Fragment>
            <span
                className={classes.lineItemLabel}
                data-cy="PriceSummary-GiftOptionsSummary-label"
            >
                <FormattedMessage
                    id={'giftOptionsSummary.lineItemLabel'}
                    defaultMessage={'Printed Card'}
                />
            </span>
            <span className={classes.price}>
                <Price
                    value={giftOptions.value}
                    currencyCode={giftOptions.currency}
                />
            </span>
        </Fragment>
    );
};
