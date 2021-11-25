import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Button from '../../../Button';
import Checkbox from '../../../Checkbox';
import Field from '../../../Field';
import FormError from '../../../FormError';
import LoadingIndicator, { Spinner } from '../../../LoadingIndicator';
import TextArea from '../../../TextArea';
import TextInput from '../../../TextInput';

import defaultClasses from './giftOptions.module.css';

/**
 * A child component of the PriceAdjustments component.
 * This component displays the form for adding gift options.
 *
 * @param {Object} props
 * @param {Object} [props.classes] CSS className overrides.
 * @param {Object} [props.giftOptionsConfigData] store config data.
 * See [giftOptions.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import GiftOptions from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions";
 */
const GiftOptions = props => {
    const { classes: propClasses } = props;
    const {
        loading,
        savingOptions,
        errors,
        giftReceiptProps,
        printedCardProps,
        giftMessageResult,
        hasGiftMessage,
        showGiftMessageResult,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        removeGiftMessageButtonProps,
        editGiftMessageButtonProps,
        cancelGiftMessageButtonProps,
        updateGiftMessageButtonProps,
        optionsFormProps
    } = useGiftOptions();
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    if (loading) {
        return <LoadingIndicator />;
    }

    const { allow_order, allow_gift_receipt, allow_printed_card } =
        props?.giftOptionsConfigData || {};

    const includeGiftReceipt =
        allow_gift_receipt === '1' ? (
            <div className={classes.option}>
                <div className={classes.checkboxContainer}>
                    <Checkbox
                        {...giftReceiptProps}
                        data-cy="GiftOptions-includeGiftReceipt"
                        label={formatMessage({
                            id: 'giftOptions.includeGiftReceipt',
                            defaultMessage: 'Include gift receipt (Optional)'
                        })}
                    />
                </div>

                {savingOptions.includes(giftReceiptProps.field) ? (
                    <div className={classes.savingContainer}>
                        <span className={classes.savingText}>
                            <FormattedMessage
                                id={'giftOptions.saving'}
                                defaultMessage={'Saving'}
                            />
                        </span>
                        <Spinner classes={{ root: classes.savingSpinner }} />
                    </div>
                ) : null}
            </div>
        ) : null;

    const includePrintedCard =
        allow_printed_card === '1' ? (
            <div className={classes.option}>
                <div className={classes.checkboxContainer}>
                    <Checkbox
                        {...printedCardProps}
                        data-cy="GiftOptions-includePrintedCard"
                        label={formatMessage({
                            id: 'giftOptions.includePrintedCard',
                            defaultMessage: 'Include printed card (Optional)'
                        })}
                    />
                </div>

                {savingOptions.includes(printedCardProps.field) ? (
                    <div className={classes.savingContainer}>
                        <span className={classes.savingText}>
                            <FormattedMessage
                                id={'giftOptions.saving'}
                                defaultMessage={'Saving'}
                            />
                        </span>
                        <Spinner classes={{ root: classes.savingSpinner }} />
                    </div>
                ) : null}
            </div>
        ) : null;

    const includeGiftMessage =
        allow_order === '1' ? (
            <div className={classes.giftMessage}>
                <div className={classes.giftMessageTitleContainer}>
                    <div className={classes.giftMessageTitle}>
                        <FormattedMessage
                            id="giftOptions.giftMessageTitle"
                            defaultMessage="Gift Message (Optional)"
                        />
                    </div>

                    {savingOptions.includes('giftMessage') ? (
                        <div className={classes.savingContainer}>
                            <span className={classes.savingText}>
                                <FormattedMessage
                                    id={'giftOptions.saving'}
                                    defaultMessage={'Saving'}
                                />
                            </span>
                            <Spinner
                                classes={{ root: classes.savingSpinner }}
                            />
                        </div>
                    ) : null}
                </div>

                <div
                    className={
                        showGiftMessageResult
                            ? classes.giftMessageResult
                            : classes.hidden
                    }
                >
                    <p>
                        <FormattedMessage
                            id="giftOptions.giftMessageTo"
                            defaultMessage="To: {cardTo}"
                            values={{
                                cardTo: giftMessageResult.cardTo
                            }}
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id="giftOptions.giftMessageFrom"
                            defaultMessage="From: {cardFrom}"
                            values={{
                                cardFrom: giftMessageResult.cardFrom
                            }}
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id="giftOptions.giftMessageMessage"
                            defaultMessage="Message:"
                        />
                    </p>
                    <p>{giftMessageResult.cardMessage}</p>
                </div>

                <div
                    className={
                        !showGiftMessageResult
                            ? classes.giftMessageFields
                            : classes.hidden
                    }
                >
                    <Field
                        id="to"
                        label={formatMessage({
                            id: 'giftOptions.to',
                            defaultMessage: 'To'
                        })}
                    >
                        <TextInput
                            {...cardToProps}
                            data-cy="GiftOptions-cardTo"
                        />
                    </Field>
                    <Field
                        id={cardFromProps.field}
                        label={formatMessage({
                            id: 'giftOptions.from',
                            defaultMessage: 'From'
                        })}
                    >
                        <TextInput
                            {...cardFromProps}
                            data-cy="GiftOptions-cardFrom"
                        />
                    </Field>
                    <div className={classes.option}>
                        <Field
                            id="message"
                            label={formatMessage({
                                id: 'giftOptions.Message',
                                defaultMessage: 'Message'
                            })}
                        >
                            <TextArea
                                {...cardMessageProps}
                                data-cy="GiftOptions-cardMessage"
                                placeholder={formatMessage({
                                    id: 'giftOptions.cardMessage',
                                    defaultMessage: 'Enter your message here'
                                })}
                            />
                        </Field>
                    </div>
                </div>

                {showGiftMessageResult ? (
                    <div className={classes.giftMessageActions}>
                        <Button {...removeGiftMessageButtonProps}>
                            <FormattedMessage
                                id="giftOptions.removeGiftMessageButton"
                                defaultMessage="Remove Gift Message"
                            />
                        </Button>
                        <Button {...editGiftMessageButtonProps}>
                            <FormattedMessage
                                id="giftOptions.editGiftMessageButton"
                                defaultMessage="Edit Gift Message"
                            />
                        </Button>
                    </div>
                ) : (
                    <div className={classes.giftMessageActions}>
                        {hasGiftMessage ? (
                            <Button {...cancelGiftMessageButtonProps}>
                                <FormattedMessage
                                    id="giftOptions.cancelGiftMessageButton"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                        ) : null}
                        <Button {...updateGiftMessageButtonProps}>
                            {hasGiftMessage ? (
                                <FormattedMessage
                                    id="giftOptions.updateGiftMessageButton"
                                    defaultMessage="Update Gift Message"
                                />
                            ) : (
                                <FormattedMessage
                                    id="giftOptions.addGiftMessage"
                                    defaultMessage="Add Gift Message"
                                />
                            )}
                        </Button>
                    </div>
                )}
            </div>
        ) : null;

    return (
        <Form {...optionsFormProps} className={classes.root}>
            <FormError errors={Array.from(errors.values())} />
            {includeGiftReceipt}
            {includePrintedCard}
            {includeGiftMessage}
        </Form>
    );
};

export default GiftOptions;
