import React from 'react';
import { useIntl } from 'react-intl';
import { func } from 'prop-types';

import { useStyle } from '../../../classify';
import { Accordion, Section } from '../../Accordion';
import CouponCode from '../../CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '../../CartPage/PriceAdjustments/giftCardSection';
import GiftOptions from '../../CartPage/PriceAdjustments/GiftOptions';

import defaultClasses from './priceAdjustments.css';

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { setPageIsUpdating } = props;
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'checkoutPage.couponCode',
                        defaultMessage: 'Enter Coupon Code'
                    })}
                >
                    <CouponCode setIsCartUpdating={setPageIsUpdating} />
                </Section>
                <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
                <Section
                    id={'gift_options'}
                    title={formatMessage({
                        id: 'checkoutPage.giftOptions',
                        defaultMessage: 'See Gift Options'
                    })}
                >
                    <GiftOptions />
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};
