import React from 'react';

import { Accordion, Section } from '../../Accordion';
import CouponCode from './CouponCode';
import GiftCard from './GiftCard';
import GiftOptions from './GiftOptions';
import { mergeClasses } from '../../../classify';

import defaultClasses from './priceAdjustments.css';

const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode />
                </Section>
                <Section id={'gift_card'} title={'Apply Gift Card'}>
                    <GiftCard />
                </Section>
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <GiftOptions />
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;
