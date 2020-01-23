import React from 'react';

import { useApplyButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useApplyButton';

import Button from '../../Button';

const ApplyButton = props => {
    const { handleApplyCard } = props;

    const { handleApplyCardWithCode } = useApplyButton({
        handleApplyCard
    });

    //const buttonDisabled = Boolean(applyLoading);
    const buttonDisabled = false;

    return <Button disabled={buttonDisabled} onClick={handleApplyCardWithCode}>Apply</Button>;
};

export default ApplyButton;
