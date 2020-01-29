import React, { Fragment } from 'react';

import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';

import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCard.css';

const GiftCard = props => {
    const {
        // appliedBalance,
        code,
        // currentBalance,
        // expirationDate,
        handleRemoveCard,
        isRemovingCard
    } = props;

    const { handleRemoveCardWithCode } = useGiftCard({
        code,
        handleRemoveCard
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span className={classes.card_info}>{code}</span>
            <button
                className={classes.remove}
                disabled={isRemovingCard}
                onClick={handleRemoveCardWithCode}
            >
                Remove
            </button>
        </Fragment>
    );
};

export default GiftCard;
