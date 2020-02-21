import React, { Fragment } from 'react';

import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCard.css';

const GiftCard = props => {
    const { code, currentBalance, isRemovingCard, removeGiftCard } = props;

    const { removeGiftCardWithCode } = useGiftCard({
        code,
        removeGiftCard
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <div className={classes.card_info}>
                <span className={classes.code}>{code}</span>
                <span className={classes.balance}>
                    {`Balance: `}
                    <Price
                        value={currentBalance.value}
                        currencyCode={currentBalance.currency}
                    />
                </span>
            </div>
            <button
                className={classes.remove}
                disabled={isRemovingCard}
                onClick={removeGiftCardWithCode}
            >
                Remove
            </button>
        </Fragment>
    );
};

export default GiftCard;
