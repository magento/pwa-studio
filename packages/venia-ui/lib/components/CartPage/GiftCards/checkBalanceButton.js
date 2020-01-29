import React from 'react';

import { useCheckBalanceButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useCheckBalanceButton';

const CheckBalanceButton = props => {
    const { className, disabled, handleCheckCardBalance } = props;

    const { handleCheckCardBalanceWithCode } = useCheckBalanceButton({
        handleCheckCardBalance
    });

    return (
        <button
            className={className}
            disabled={disabled}
            onClick={handleCheckCardBalanceWithCode}
        >
            {`Check Gift Card Balance`}
        </button>
    );
};

export default CheckBalanceButton;
