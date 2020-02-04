import React from 'react';

import { useApplyButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useApplyButton';

import Button from '../../Button';

const ApplyButton = props => {
    const { applyGiftCard, className, disabled } = props;

    const { applyGiftCardWithCode } = useApplyButton({
        applyGiftCard
    });

    return (
        <Button
            classes={{ root_normalPriority: className }}
            disabled={disabled}
            onClick={applyGiftCardWithCode}
        >
            {`Apply`}
        </Button>
    );
};

export default ApplyButton;
