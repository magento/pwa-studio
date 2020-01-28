import React from 'react';
import { Form } from 'informed';
import { X as CloseIcon } from 'react-feather';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Field from '../../Field';
import Icon from '../../Icon';
import LoadingIndicator from '../../LoadingIndicator';
import TextInput from '../../TextInput';
import Trigger from '../../Trigger';
import ApplyButton from './applyButton';
import CheckBalanceButton from './checkBalanceButton';
import defaultClasses from './giftCards.css';
import GiftCard from './giftCard';

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
        removeCardMutation: REMOVE_GIFT_CARD_MUTATION
    });
    const {
        applyCardResult,
        balanceResult,
        canTogglePromptState,
        cartResult,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        removeCardResult,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry,
        togglePromptState
    } = talonProps;

    if (cartResult.loading) return loadingIndicator;
    if (cartResult.error) {
        return (
            <span>
                There was an error loading gift cards. Please refresh to try
                again.
            </span>
        );
    }

    const cardsData = cartResult.data.cart.applied_gift_cards;
    const classes = mergeClasses(defaultClasses, props.classes);
    const isApplyingCard = applyCardResult.loading;
    const isCheckingBalance = balanceResult.loading;

    let listContents = null;
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

        listContents = (
            <div className={classes.cards_container}>{cardList}</div>
        );
    }

    const addCardContents = (
        <button className={classes.show_entry} onClick={togglePromptState}>
            {`+ Add another gift card`}
        </button>
    );
    const cardEntryContents = (
        <div className={classes.card}>
            <Field
                classes={{ root: classes.entry }}
                id={classes.card}
                label="Gift Card Number"
            >
                <div className={classes.card_input}>
                    <span style={{ width: '100%'}}>
                        <TextInput
                            id={classes.card}
                            disabled={isApplyingCard || isCheckingBalance}
                            field="card"
                            message="test message"
                        />
                    </span>
                    <ApplyButton
                        disabled={isApplyingCard}
                        handleApplyCard={handleApplyCard}
                    />
                    {canTogglePromptState && (
                        <Trigger action={togglePromptState}>
                            <Icon src={CloseIcon} />
                        </Trigger>
                    )}
                </div>
            </Field>
            {shouldDisplayCardBalance && (
                <div className={classes.balance}>
                    <span>{balanceResult.data.giftCardAccount.code}</span>
                    <span className={classes.price}>
                        {`Balance: `}
                        <Price
                            value={
                                balanceResult.data.giftCardAccount.balance
                                    .value
                            }
                            currencyCode={
                                balanceResult.data.giftCardAccount.balance
                                    .currency
                            }
                        />
                    </span>
                </div>
            )}
            <CheckBalanceButton
                disabled={isCheckingBalance}
                handleCheckCardBalance={handleCheckCardBalance}
            />
        </div>
    );

    const newCardContents = shouldDisplayCardEntry ? cardEntryContents : addCardContents;

    return (
        <div className={classes.root}>
            {listContents}
            <div className={classes.prompt}>
                <Form>
                    { newCardContents }
                </Form>
            </div>
        </div>
    );
};

export default GiftCards;
