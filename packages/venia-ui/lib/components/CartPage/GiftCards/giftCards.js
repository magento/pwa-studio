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

import {
    GET_CART_DETAILS_QUERY,
    GET_GIFT_CARD_BALANCE_QUERY,
    APPLY_GIFT_CARD_MUTATION,
    REMOVE_GIFT_CARD_MUTATION
} from './giftCardQueries';

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
        canTogglePromptState,
        checkBalanceData,
        errorLoadingGiftCards,
        errorApplyingCard,
        errorCheckingBalance,
        errorRemovingCard,
        giftCardsData,
        handleApplyCard,
        handleCheckCardBalance,
        handleRemoveCard,
        isLoadingGiftCards,
        isApplyingCard,
        isCheckingBalance,
        isRemovingCard,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry,
        togglePromptState
    } = talonProps;

    if (isLoadingGiftCards) return loadingIndicator;
    if (errorLoadingGiftCards) {
        return (
            <span>
                There was an error loading gift cards. Please refresh to try
                again.
            </span>
        );
    }

    console.log('I should display card balance?', shouldDisplayCardBalance);
    console.log('The data I have to do so is', checkBalanceData);

    const classes = mergeClasses(defaultClasses, props.classes);
    const cardEntryErrorMessage = errorCheckingBalance ? `Invalid card number. Please try again.` : null;

    let listContents = null;
    if (giftCardsData.length > 0) {
        const cardList = giftCardsData.map(giftCardData => {
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
                            message={cardEntryErrorMessage}
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
                    <span>{checkBalanceData.code}</span>
                    <span className={classes.price}>
                        {`Balance: `}
                        <Price
                            value={checkBalanceData.balance.value}
                            currencyCode={checkBalanceData.balance.currency}
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
