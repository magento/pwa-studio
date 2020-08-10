import React from 'react';
import { func } from 'prop-types';

import { mergeClasses } from '../../../classify';
import { Accordion, Section } from '../../Accordion';
import CouponCode from './CouponCode';
import GiftCardSection from './giftCardSection';
import GiftOptions from './GiftOptions';
import ShippingMethods from './ShippingMethods';

import defaultClasses from './priceAdjustments.css';

/**
 * Renders the price adjustments forms for applying gift cards or coupons.
 * 
 * @param {Object} props Component props
 * @param {Function} props.setIsCartUpdating Callback function called when cart updates
 * @param {Object} props.classes CSS className overrides.
 * See [priceAdjustments.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.css}
 * for a list of classes you can override.
 * 
 * @returns {React.Element} A React component that shows price adjustment forms
 */
const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { setIsCartUpdating } = props;

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    title={'Estimate your Shipping'}
                >
                    <ShippingMethods setIsCartUpdating={setIsCartUpdating} />
                </Section>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode setIsCartUpdating={setIsCartUpdating} />
                </Section>
                <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <GiftOptions />
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setIsCartUpdating: func
};
