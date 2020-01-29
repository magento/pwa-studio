import React from 'react';

import { useApplyButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useApplyButton';

import Button from '../../Button';

const ApplyButton = props => {
    const { className, disabled, handleApplyCard } = props;

    const { handleApplyCardWithCode } = useApplyButton({
        handleApplyCard
    });

    return (
        <Button
            classes={{ root_normalPriority: className }}
            disabled={disabled}
            onClick={handleApplyCardWithCode}
        >
            {`Apply`}
        </Button>
    );
};

export default ApplyButton;
