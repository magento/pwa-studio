import React, { Fragment } from 'react';

import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';

import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCard.css';

const GiftCard = props => {
    const { code, isRemovingCard, removeGiftCard } = props;

    const { removeGiftCardWithCode } = useGiftCard({
        code,
        removeGiftCard
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span className={classes.card_info}>{code}</span>
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
