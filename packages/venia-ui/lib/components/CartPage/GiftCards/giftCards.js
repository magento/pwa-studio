import React from 'react';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';

import { mergeClasses } from '../../../classify';
import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';
import defaultClasses from './giftCards.css';
import GiftCard from './giftCard';
import GiftCardPrompt from './giftCardPrompt';

const DUMMY_DATA_ZERO = [];
const DUMMY_DATA_ONE = [
    {
        applied_balance: {
            currency: 'US',
            value: 20
        },
        code: 'ABC123',
        current_balance: {
            currency: 'US',
            value: 30
        },
        expiration_date: '1579270441046'
    }
];
const DUMMY_DATA_MULTIPLE = [
    {
        applied_balance: {
            currency: 'US',
            value: 20
        },
        code: 'ABC123',
        current_balance: {
            currency: 'US',
            value: 30
        },
        expiration_date: '1579270441046'
    },
    {
        applied_balance: {
            currency: 'US',
            value: 40
        },
        code: 'DEF456',
        current_balance: {
            currency: 'US',
            value: 10
        },
        expiration_date: '1579270441046'
    }
];

const GiftCards = props => {
    const talonProps = useGiftCards({
        cartQuery: GET_CART_DETAILS_QUERY
    });
    const { data, error, loading } = talonProps;

    // TODO: loading
    if (loading) return <span>Loading</span>
    // TODO: error
    if (error) return <span>Error</span>

    const classes = mergeClasses(defaultClasses, props.classes);

    //const cardsData = data.cart.applied_gift_cards;
    const cardsData = DUMMY_DATA_MULTIPLE;
    const cardList = cardsData.map(giftCardData => {
        const { applied_balance, code, current_balance, expiration_date } = giftCardData;

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
            <div className={classes.cards_container}>
                {cardList}
            </div>
            <div className={classes.prompt}>
                <GiftCardPrompt numCards={cardsData.length} />
            </div>
        </div>
    );
};

export default GiftCards;
