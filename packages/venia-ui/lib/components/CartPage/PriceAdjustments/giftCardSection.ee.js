import React from 'react';

import { Section } from '../../Accordion';
import GiftCards from '../GiftCards';

const GiftCardSection = props => {
    const { setIsCartUpdating } = props;
    return (
        <Section id={'gift_card'} title={'Apply Gift Card'}>
            <GiftCards setIsCartUpdating={setIsCartUpdating} />
        </Section>
    );
};

export default GiftCardSection;
