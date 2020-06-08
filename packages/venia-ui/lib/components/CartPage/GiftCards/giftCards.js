import React, { useEffect } from 'react';
import { Form } from 'informed';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';
import { Price, useToasts } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import Icon from '../../Icon';
import LoadingIndicator from '../../LoadingIndicator';
import TextInput from '../../TextInput';
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
            appliedCardsQuery: GET_CART_GIFT_CARDS_QUERY,
            cardBalanceQuery: GET_GIFT_CARD_BALANCE_QUERY
        }
    });
    const {
        applyGiftCard,
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
        shouldDisplayCardError
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
        return <LoadingIndicator>{'Loading Gift Cards...'}</LoadingIndicator>;
    }
    if (errorLoadingGiftCards) {
        return (
            <span>
                {'There was an error loading gift cards. Please try again.'}
            </span>
        );
    }

    const classes = mergeClasses(defaultClasses, props.classes);
    const cardEntryErrorMessage = shouldDisplayCardError
        ? 'Invalid card. Please try again.'
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

    const cardBalance = shouldDisplayCardBalance && (
        <div className={classes.balance}>
            <span className={classes.price}>
                {'Balance: '}
                <Price
                    value={checkBalanceData.balance.value}
                    currencyCode={checkBalanceData.balance.currency}
                />
            </span>
        </div>
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
                {cardBalance}
            </Field>
            <Button
                classes={{ root_normalPriority: classes.apply_button }}
                disabled={isApplyingCard}
                onClick={applyGiftCard}
            >
                {'Apply'}
            </Button>
            <button
                className={classes.check_balance_button}
                disabled={isCheckingBalance}
                onClick={checkGiftCardBalance}
            >
                {'Check balance'}
            </button>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.entryForm}>
                <Form getApi={setFormApi}>{cardEntryContents}</Form>
            </div>
            {appliedGiftCards}
        </div>
    );
};

export default GiftCards;
