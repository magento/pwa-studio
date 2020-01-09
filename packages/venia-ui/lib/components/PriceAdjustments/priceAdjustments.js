import React from 'react';

import { Accordion, Section } from '../Accordion';

import { mergeClasses } from '../../classify';
import defaultClasses from './priceAdjustments.css';

const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section title={'Select a Shipping Method'} isOpen={true}>
                    <a href="https://jira.corp.magento.com/browse/PWA-239">
                        Shipping Methods to be completed by PWA-239.
                    </a>
                </Section>
                <Section title={'Enter a Coupon Code'}>
                    <a href="https://jira.corp.magento.com/browse/PWA-75">
                        Coupon Codes to be completed by PWA-75.
                    </a>
                </Section>
                <Section title={'Apply Gift Card'}>
                    <a href="https://jira.corp.magento.com/browse/PWA-78">
                        Gift Cards to be completed by PWA-78.
                    </a>
                </Section>
                <Section title={'See Gift Options'}>
                    <a href="https://jira.corp.magento.com/browse/PWA-178">
                        Gift Options to be completed by PWA-178.
                    </a>
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;
