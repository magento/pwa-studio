import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';
import { Price, useToasts } from '@magento/peregrine';

import { useStyle } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import Icon from '../../Icon';
import LinkButton from '../../LinkButton';
import LoadingIndicator from '../../LoadingIndicator';
import TextInput from '../../TextInput';
import defaultClasses from './giftCards.module.css';
import GiftCard from './giftCard';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

/**
 * GiftCards is a child component of the CartPage component.
 * This component shows a form for applying gift cards along with a list of applied
 * Gift Cards in the shopping cart.
 *
 * @param {Object} props Component props
 * @param {Function} props.setIsCartUpdating Callback function to call when adding or removing a gift card
 * @param {Object} props.classes CSS className overrides.
 * See [giftCards.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/GiftCards/giftCards.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import GiftCards from '@magento/venia-ui/lib/components/CartPage/GiftCards';
 */
const GiftCards = props => {
    const talonProps = useGiftCards({
        setIsCartUpdating: props.setIsCartUpdating
    });
    const {
        applyGiftCard,
        checkBalanceData,
        checkGiftCardBalance,
        checkGiftCardBalanceKeyPress,
        errorLoadingGiftCards,
        errorRemovingCard,
        giftCardsData,
        handleEnterKeyPress,
        isLoadingGiftCards,
        isApplyingCard,
        isCheckingBalance,
        isRemovingCard,
        removeGiftCard,
        shouldDisplayCardBalance,
        shouldDisplayCardError
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (errorRemovingCard) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: formatMessage({
                    id: 'giftCards.errorRemoving',
                    defaultMessage:
                        'Unable to remove gift card. Please try again.'
                }),
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorRemovingCard, formatMessage]);

    if (isLoadingGiftCards) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'giftCards.loading'}
                    defaultMessage={'Loading Gift Cards...'}
                />
            </LoadingIndicator>
        );
    }

    const cardEntryErrorMessage = shouldDisplayCardError
        ? formatMessage({
              id: 'giftCards.errorInvalid',
              defaultMessage: 'Invalid card. Please try again.'
          })
        : null;

    let appliedGiftCards = null;
    if (errorLoadingGiftCards) {
        appliedGiftCards = (
            <span className={classes.errorText}>
                <FormattedMessage
                    id={'giftCards.errorLoading'}
                    defaultMessage={
                        'There was an error loading applied gift cards. Please refresh and try again.'
                    }
                />
            </span>
        );
    }
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

    const containerClass = shouldDisplayCardError
        ? classes.card_input_container_error
        : classes.card_input_container;

    const cardBalance = (
        <div className={classes.balance}>
            {checkBalanceData && shouldDisplayCardBalance ? (
                <div className={classes.price}>
                    <FormattedMessage
                        id={'giftCards.balance'}
                        defaultMessage={'Balance: '}
                    />
                    <Price
                        value={checkBalanceData.balance.value}
                        currencyCode={checkBalanceData.balance.currency}
                    />
                </div>
            ) : (
                <span className={classes.invalid_card_error}>
                    {cardEntryErrorMessage}
                </span>
            )}
        </div>
    );

    const cardEntryContents = (
        <div className={classes.card}>
            <Field
                classes={{
                    root: classes.entry
                }}
                id={classes.card}
                label={formatMessage({
                    id: 'giftCards.cardNumber',
                    defaultMessage: 'Gift Card Number'
                })}
            >
                <div className={containerClass}>
                    <TextInput
                        id={classes.card}
                        data-cy="GiftCards-card"
                        disabled={isApplyingCard || isCheckingBalance}
                        field="card"
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        // message={cardEntryErrorMessage}
                        placeholder={formatMessage({
                            id: 'giftCards.cardEntry',
                            defaultMessage: 'Enter card number'
                        })}
                        validate={isRequired}
                    />
                </div>
                <span aria-live="polite">{cardBalance}</span>
            </Field>
            <Field
                classes={{
                    label: classes.applyLabel
                }}
            >
                <Button
                    priority={'normal'}
                    data-cy="GiftCards-apply"
                    disabled={isApplyingCard}
                    onClick={applyGiftCard}
                    onKeyDown={handleEnterKeyPress}
                >
                    <FormattedMessage
                        id={'giftCards.apply'}
                        defaultMessage={'Apply'}
                    />
                </Button>
            </Field>
            <LinkButton
                className={classes.check_balance_button}
                disabled={isCheckingBalance}
                onClick={checkGiftCardBalance}
                onKeyDown={checkGiftCardBalanceKeyPress}
            >
                <FormattedMessage
                    id={'giftCards.checkBalance'}
                    defaultMessage={'Check balance'}
                />
            </LinkButton>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.entryForm}>{cardEntryContents}</div>
            {appliedGiftCards}
        </div>
    );
};

export default props => {
    return (
        <Form data-cy="GiftCards-form">
            <GiftCards {...props} />
        </Form>
    );
};
