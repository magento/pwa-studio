import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import { Section } from '../../Accordion';

const GiftCards = React.lazy(() => import('../GiftCards'));

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
            <Suspense fallback={null}>
                <GiftCards setIsCartUpdating={setIsCartUpdating} />
            </Suspense>
        </Section>
    );
};

export default GiftCardSection;
