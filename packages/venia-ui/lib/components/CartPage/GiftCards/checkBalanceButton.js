import React from 'react';

import { useCheckBalanceButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useCheckBalanceButton';

import Button from '../../Button';

const CheckBalanceButton = () => {
    const { handleCheckBalance } = useCheckBalanceButton();

    return (
        <Button onClick={handleCheckBalance}>Check Gift Card balance</Button>
    );
};

export default CheckBalanceButton;
