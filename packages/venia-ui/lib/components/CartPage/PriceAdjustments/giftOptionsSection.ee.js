import React from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Section } from '@magento/venia-ui/lib/components/Accordion';
import { useGiftOptionsSection } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useGiftOptionsSection';

const GiftOptions = loadable(() => import('./GiftOptions'), {
    fallback: <LoadingIndicator />
});

const GiftOptionsSection = () => {
    const { formatMessage } = useIntl();
    const {
        giftOptionsConfigData,
        isLoading,
        isVisible
    } = useGiftOptionsSection();

    if (isLoading || !isVisible) {
        return null;
    }

    return (
        <Section
            id={'gift_options'}
            data-cy="PriceAdjustments-giftOptionsSection"
            title={formatMessage({
                id: 'priceAdjustments.giftOptions',
                defaultMessage: 'See Gift Options'
            })}
        >
            <GiftOptions giftOptionsConfigData={giftOptionsConfigData} />
        </Section>
    );
};

export default GiftOptionsSection;
