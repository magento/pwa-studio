import React from 'react';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';

import { mergeClasses } from '../../../classify';
import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';
import LoadingIndicator from '../../LoadingIndicator';
import defaultClasses from './giftCards.css';
import GiftCard from './giftCard';
import GiftCardPrompt from './giftCardPrompt';

const loadingIndicator = (
    <LoadingIndicator>{`Loading Gift Cards...`}</LoadingIndicator>
);

const GiftCards = props => {
    const talonProps = useGiftCards({
        cartQuery: GET_CART_DETAILS_QUERY
    });
    const { data, error, loading } = talonProps;

    // TODO: loading
    if (loading) return loadingIndicator;
    // TODO: error
    if (error) return <span>There was an error loading gift cards. Please try again.</span>;

    const classes = mergeClasses(defaultClasses, props.classes);

    const cardsData = data.cart.applied_gift_cards;
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
                key={code}
            />
        );
    });

    return (
        <div className={classes.root}>
            <div className={classes.cards_container}>{cardList}</div>
            <div className={classes.prompt}>
                <GiftCardPrompt numCards={cardsData.length} />
            </div>
        </div>
    );
};

export default GiftCards;
