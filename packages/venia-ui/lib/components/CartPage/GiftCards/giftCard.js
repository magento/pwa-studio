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
        handleRemoveCard
    } = props;

    const { handleRemoveCardWithCode } = useGiftCard({
        code,
        handleRemoveCard
    });

    // TODO: isRemoving
    const isRemoving = false;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span className={classes.card_info}>{code}</span>
            <button
                className={classes.remove}
                disabled={isRemoving}
                onClick={handleRemoveCardWithCode}
            >
                Remove
            </button>
        </Fragment>
    );
};

export default GiftCard;
