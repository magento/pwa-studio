import React from 'react';

import { Section } from '../../Accordion';
import GiftCards from '../GiftCards';

const GiftCardSection = () => {
    return (
        <Section id={'gift_card'} title={'Apply Gift Card'}>
            <GiftCards />
        </Section>
    );
};

export default GiftCardSection;
