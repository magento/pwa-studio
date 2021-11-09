import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Section } from '../../Accordion';

const GiftCards = React.lazy(() => import('../GiftCards'));

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
            <Suspense fallback={<LoadingIndicator />}>
                <GiftCards setIsCartUpdating={setIsCartUpdating} />
            </Suspense>
        </Section>
    );
};

export default GiftCardSection;
