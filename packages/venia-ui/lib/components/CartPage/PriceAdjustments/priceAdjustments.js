import React from 'react';

import { Accordion, Section } from '../../Accordion';

import { mergeClasses } from '../../../classify';
import ShippingMethods from './ShippingMethods';
import defaultClasses from './priceAdjustments.css';
import CouponCode from './CouponCode';

const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    // TODO: Minimizing accordion views actually unmounts the components. If a component does things, like make a query, on mount, it may make unnecessary queries. Can we just hide the content?
    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    title={'Estimate your Shipping'}
                    isOpen={true}
                >
                    <ShippingMethods />
                </Section>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode />
                </Section>
                <Section id={'gift_card'} title={'Apply Gift Card'}>
                    <a href="https://jira.corp.magento.com/browse/PWA-78">
                        Gift Cards to be completed by PWA-78.
                    </a>
                </Section>
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <a href="https://jira.corp.magento.com/browse/PWA-178">
                        Gift Options to be completed by PWA-178.
                    </a>
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;
