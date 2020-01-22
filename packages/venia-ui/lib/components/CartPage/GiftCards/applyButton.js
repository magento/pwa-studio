import React, { Fragment } from 'react';

import { useApplyButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useApplyButton';

import Button from '../../Button';

import APPLY_GIFT_CARD_MUTATION from '../../../queries/applyGiftCard.graphql';

const ApplyButton = () => {
    const talonProps = useApplyButton({
        applyGiftCard: APPLY_GIFT_CARD_MUTATION
    });

    const {
        applyData,
        applyError,
        applyLoading,
        handleApplyCard
     } = talonProps;

    const buttonDisabled = Boolean(applyLoading);

    return <Button disabled={buttonDisabled} onClick={handleApplyCard}>Apply</Button>;
};

export default ApplyButton;
