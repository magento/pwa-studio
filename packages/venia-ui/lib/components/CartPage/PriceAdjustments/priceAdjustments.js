import React from 'react';

import { Accordion, Section } from '../../Accordion';
import CouponCode from './CouponCode';
import GiftCardSection from './giftCardSection';
import GiftOptions from './GiftOptions';

import { mergeClasses } from '../../../classify';
import ShippingMethods from './ShippingMethods';
import defaultClasses from './priceAdjustments.css';

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
