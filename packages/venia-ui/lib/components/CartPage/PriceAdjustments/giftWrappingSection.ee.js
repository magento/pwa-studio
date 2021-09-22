import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Section } from '../../Accordion';
import { useGiftWrappingSection } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useGiftWrappingSection';

const GiftOptions = React.lazy(() => import('./GiftOptions'));

const GiftWrappingSection = () => {
    const { formatMessage } = useIntl();
    const {
        wrappingConfigData,
        isLoading,
        isVisiable
    } = useGiftWrappingSection();

    if (isLoading || !isVisiable) {
        return null;
    }

    return (
        <Section
            id={'gift_options'}
            title={formatMessage({
                id: 'priceAdjustments.giftOptions',
                defaultMessage: 'See Gift Options'
            })}
        >
            <Suspense fallback={<LoadingIndicator />}>
                <GiftOptions wrappingConfigData={wrappingConfigData} />
            </Suspense>
        </Section>
    );
};

export default GiftWrappingSection;
