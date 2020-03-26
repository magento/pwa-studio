import React, { useEffect } from 'react';
import { Form } from 'informed';
import { AlertCircle as AlertCircleIcon, X as CloseIcon } from 'react-feather';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';
import { Price, useToasts } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import Icon from '../../Icon';
import LoadingIndicator from '../../LoadingIndicator';
import TextInput from '../../TextInput';
import Trigger from '../../Trigger';
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
        setIsCartUpdating: props.setIsCartUpdating,
        mutations: {
            applyCardMutation: APPLY_GIFT_CARD_MUTATION,
            removeCardMutation: REMOVE_GIFT_CARD_MUTATION
        },
        queries: {
            cardBalanceQuery: GET_GIFT_CARD_BALANCE_QUERY,
            cartQuery: GET_CART_GIFT_CARDS_QUERY
        }
    });
    const {
        applyGiftCard,
        canTogglePromptState,
        checkBalanceData,
        checkGiftCardBalance,
        errorLoadingGiftCards,
        errorRemovingCard,
        giftCardsData,
        isLoadingGiftCards,
        isApplyingCard,
        isCheckingBalance,
        isRemovingCard,
        removeGiftCard,
        setFormApi,
        shouldDisplayCardBalance,
        shouldDisplayCardEntry,
        shouldDisplayCardError,
        submitForm,
        togglePromptState
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
    const cardEntryErrorMessage = shouldDisplayCardError
        ? `Invalid card. Please try again.`
        : null;

    let appliedGiftCards = null;
    if (giftCardsData.length > 0) {
        const cardList = giftCardsData.map(giftCardData => {
            const { code, current_balance } = giftCardData;

            return (
                <GiftCard
                    code={code}
                    currentBalance={current_balance}
                    isRemovingCard={isRemovingCard}
                    key={code}
                    removeGiftCard={removeGiftCard}
                />
            );
        });

        appliedGiftCards = (
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
                <div className={classes.card_input_container}>
                    <TextInput
                        id={classes.card}
                        disabled={isApplyingCard || isCheckingBalance}
                        field="card"
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        message={cardEntryErrorMessage}
                        placeholder={'Enter card number'}
                        validate={isRequired}
                    />
                </div>
            </Field>
            <Button
                classes={{ root_normalPriority: classes.apply_button }}
                disabled={isApplyingCard}
                onClick={applyGiftCard}
            >
                {`Apply`}
            </Button>
            {canTogglePromptState && (
                <Trigger
                    action={togglePromptState}
                    classes={{ root: classes.toggle_button }}
                >
                    <Icon src={CloseIcon} />
                </Trigger>
            )}
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
            <button
                className={classes.check_balance_button}
                disabled={isCheckingBalance}
                onClick={checkGiftCardBalance}
            >
                {`Check Gift Card Balance`}
            </button>
        </div>
    );

    const newCardContents = shouldDisplayCardEntry
        ? cardEntryContents
        : addCardContents;

    return (
        <div className={classes.root}>
            {appliedGiftCards}
            <div className={classes.prompt}>
                <Form onSubmit={submitForm} getApi={setFormApi}>
                    {newCardContents}
                </Form>
            </div>
        </div>
    );
};

export default GiftCards;
