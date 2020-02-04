import React from 'react';

import { useCheckBalanceButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useCheckBalanceButton';

const CheckBalanceButton = props => {
    const { checkGiftCardBalance, className, disabled } = props;

    const { checkGiftCardBalanceWithCode } = useCheckBalanceButton({
        checkGiftCardBalance
    });

    return (
        <button
            className={className}
            disabled={disabled}
            onClick={checkGiftCardBalanceWithCode}
        >
            {`Check Gift Card Balance`}
        </button>
    );
};

export default CheckBalanceButton;
