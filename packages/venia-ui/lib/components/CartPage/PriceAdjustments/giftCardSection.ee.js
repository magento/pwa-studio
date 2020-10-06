import React from 'react';
import { useIntl } from 'react-intl';

import { Section } from '../../Accordion';
import GiftCards from '../GiftCards';

const GiftCardSection = props => {
    const { setIsCartUpdating } = props;
    const { formatMessage } = useIntl();
    return (
        <Section
            id={'gift_card'}
            title={formatMessage({
                id: 'giftCardSection.giftCard',
                defaultMessage: 'Apply Gift Card'
            })}
        >
            <GiftCards setIsCartUpdating={setIsCartUpdating} />
        </Section>
    );
};

export default GiftCardSection;
