import React from 'react';

import { Accordion, Section } from '../../Accordion';
import GiftCards from '../GiftCards';

import { mergeClasses } from '../../../classify';
import defaultClasses from './priceAdjustments.css';

const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    title={'Select Shipping Method'}
                >
                    <a href="https://jira.corp.magento.com/browse/PWA-239">
                        Shipping Methods to be completed by PWA-239.
                    </a>
                </Section>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <a href="https://jira.corp.magento.com/browse/PWA-75">
                        Coupon Codes to be completed by PWA-75.
                    </a>
                </Section>
                <Section
                    id={'gift_card'}
                    isOpen={true}
                    title={'Apply Gift Card'}
                >
                    <GiftCards />
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
