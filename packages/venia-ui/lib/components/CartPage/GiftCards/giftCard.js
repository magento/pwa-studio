import React, { Fragment } from 'react';

import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';

import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCard.css';

import REMOVE_GIFT_CARD from '../../../queries/removeGiftCard.graphql';

const GiftCard = props => {
    const { appliedBalance, code, currentBalance, expirationDate } = props;

    const talonProps = useGiftCard({
        giftCardCode: code,
        removeGiftCardMutation: REMOVE_GIFT_CARD
    });
    const { handleRemoveGiftCard, isRemoving } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span className={classes.card_info}>{code}</span>
            <button
                className={classes.remove}
                disabled={isRemoving}
                onClick={handleRemoveGiftCard}
            >
                Remove
            </button>
        </Fragment>
    );
};

export default GiftCard;
