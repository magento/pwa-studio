import React, { useContext } from 'react';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import defaultClasses from './giftCards.css';
import GiftCard from './giftCard';
import GiftCardPrompt from './giftCardPrompt';

import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';
import GET_GIFT_CARD_BALANCE_QUERY from '../../../queries/getGiftCardBalance.graphql';
import APPLY_GIFT_CARD_MUTATION from '../../../queries/applyGiftCard.graphql';
import REMOVE_GIFT_CARD_MUTATION from '../../../queries/removeGiftCard.graphql';

const loadingIndicator = (
    <LoadingIndicator>{`Loading Gift Cards...`}</LoadingIndicator>
);

const GiftCards = props => {
    const talonProps = useGiftCards({
        applyCardMutation: APPLY_GIFT_CARD_MUTATION,
        cardBalanceQuery: GET_GIFT_CARD_BALANCE_QUERY,
        cartQuery: GET_CART_DETAILS_QUERY,
        removeCardMutation: REMOVE_GIFT_CARD_MUTATION,
    });
    const { data, error, handleApplyCard, handleCheckCardBalance, handleRemoveCard, loading } = talonProps;

    // TODO: loading
    if (loading) return loadingIndicator;
    // TODO: error
    if (error) return <span>There was an error loading gift cards. Please try again.</span>;

    const classes = mergeClasses(defaultClasses, props.classes);

    let listContents = null;
    const cardsData = data.cart.applied_gift_cards;
    if (cardsData.length > 0) {
        const cardList = cardsData.map(giftCardData => {
            const {
                applied_balance,
                code,
                current_balance,
                expiration_date
            } = giftCardData;
    
            return (
                <GiftCard
                    appliedBalance={applied_balance}
                    code={code}
                    currentBalance={current_balance}
                    expirationDate={expiration_date}
                    handleRemoveCard={handleRemoveCard}
                    key={code}
                />
            );
        });

        listContents = <div className={classes.cards_container}>{cardList}</div>;
    }

    return (
        <div className={classes.root}>
            {listContents}
            <div className={classes.prompt}>
                <GiftCardPrompt
                    handleApplyCard={handleApplyCard}
                    handleCheckCardBalance={handleCheckCardBalance}
                    numCards={cardsData.length}
                />
            </div>
        </div>
    );
};

export default GiftCards;
