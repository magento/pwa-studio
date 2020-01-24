import React from 'react';

import { useCheckBalanceButton } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useCheckBalanceButton';

import { mergeClasses } from '../../../classify';
import defaultClasses from './checkBalanceButton.css';

const CheckBalanceButton = props => {
    const { disabled, handleCheckCardBalance } = props;

    const { handleCheckCardBalanceWithCode } = useCheckBalanceButton({
        handleCheckCardBalance
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <button
            className={classes.root}
            disabled={disabled}
            onClick={handleCheckCardBalanceWithCode}
        >
            {`Check Gift Card Balance`}
        </button>
    );
};

export default CheckBalanceButton;
