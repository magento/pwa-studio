import React from 'react';

import { useApplyButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useApplyButton';

import Button from '../../Button';

const ApplyButton = () => {
    const { handleApplyCard } = useApplyButton();

    return <Button onClick={handleApplyCard}>Apply</Button>;
};

export default ApplyButton;
