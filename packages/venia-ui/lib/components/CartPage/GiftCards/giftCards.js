import React, { useEffect } from 'react';
import { Form } from 'informed';
import { AlertCircle as AlertCircleIcon, X as CloseIcon } from 'react-feather';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';
import { Price, useToasts } from '@magento/peregrine';

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
    GET_CART_GIFT_CARDS_QUERY,
    GET_GIFT_CARD_BALANCE_QUERY,
    APPLY_GIFT_CARD_MUTATION,
    REMOVE_GIFT_CARD_MUTATION
} from './giftCardQueries';

const errorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const GiftCards = props => {
    const talonProps = useGiftCards({
        applyCardMutation: APPLY_GIFT_CARD_MUTATION,
        cardBalanceQuery: GET_GIFT_CARD_BALANCE_QUERY,
        cartQuery: GET_CART_GIFT_CARDS_QUERY,
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
        handleTogglePromptState,
        isLoadingGiftCards,
        isApplyingCard,
        isCheckingBalance,
        isRemovingCard,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry
    } = talonProps;

    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (errorRemovingCard) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: 'Unable to remove gift card. Please try again.',
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorRemovingCard]);

    if (isLoadingGiftCards) {
        return <LoadingIndicator>{`Loading Gift Cards...`}</LoadingIndicator>;
    }
    if (errorLoadingGiftCards) {
        return (
            <span>
                {`There was an error loading gift cards. Please try again.`}
            </span>
        );
    }

    const classes = mergeClasses(defaultClasses, props.classes);
    const cardEntryErrorMessage =
        errorApplyingCard || errorCheckingBalance
            ? `Invalid card. Please try again.`
            : null;

    let appliedGiftCards = null;
    if (giftCardsData.length > 0) {
        const cardList = giftCardsData.map(giftCardData => {
            const { code } = giftCardData;

            return (
                <GiftCard
                    code={code}
                    handleRemoveCard={handleRemoveCard}
                    isRemovingCard={isRemovingCard}
                    key={code}
                />
            );
        });

        appliedGiftCards = (
            <div className={classes.cards_container}>{cardList}</div>
        );
    }

    const addCardContents = (
        <button
            className={classes.show_entry}
            onClick={handleTogglePromptState}
        >
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
                <div className={classes.card_input_container}>
                    <span>
                        <TextInput
                            id={classes.card}
                            classes={{ icons: classes.card_input }}
                            disabled={isApplyingCard || isCheckingBalance}
                            field="card"
                            message={cardEntryErrorMessage}
                            placeholder={'Enter card number'}
                        />
                    </span>
                    <ApplyButton
                        className={classes.apply_button}
                        disabled={isApplyingCard}
                        handleApplyCard={handleApplyCard}
                    />
                    {canTogglePromptState && (
                        <Trigger action={handleTogglePromptState}>
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
                className={classes.check_balance_button}
                disabled={isCheckingBalance}
                handleCheckCardBalance={handleCheckCardBalance}
            />
        </div>
    );

    const newCardContents = shouldDisplayCardEntry
        ? cardEntryContents
        : addCardContents;

    return (
        <div className={classes.root}>
            {appliedGiftCards}
            <div className={classes.prompt}>
                <Form>{newCardContents}</Form>
            </div>
        </div>
    );
};

export default GiftCards;
