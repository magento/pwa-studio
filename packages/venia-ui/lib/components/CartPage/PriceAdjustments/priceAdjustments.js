import React from 'react';

import { Accordion, Section } from '../../Accordion';

import GiftOptions from './GiftOptions';

import { mergeClasses } from '../../../classify';
import defaultClasses from './priceAdjustments.css';
import CouponCode from './CouponCode';
import GiftCardSection from './giftCardSection';

const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    isOpen={true}
                    title={'Select Shipping Method'}
                >
                    <a href="https://jira.corp.magento.com/browse/PWA-239">
                        Shipping Methods to be completed by PWA-239.
                    </a>
                </Section>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode />
                </Section>
                <GiftCardSection />
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <GiftOptions />
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;
