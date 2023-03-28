import React, { Suspense } from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Section } from '../../Accordion';

const GiftCards = loadable(() => import('../GiftCards'), {
    fallback: <LoadingIndicator />
});

const GiftCardSection = props => {
    const { setIsCartUpdating } = props;
    const { formatMessage } = useIntl();
    return (
        <Section
            id={'gift_card'}
            data-cy="PriceAdjustments-giftCardSection"
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
