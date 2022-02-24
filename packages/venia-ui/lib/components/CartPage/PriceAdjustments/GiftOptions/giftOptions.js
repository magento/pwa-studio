import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Edit2 as EditIcon } from 'react-feather';
import { Form } from 'informed';

import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator, {
    Spinner
} from '@magento/venia-ui/lib/components/LoadingIndicator';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Price from '@magento/venia-ui/lib/components/Price';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

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
        errors,
        savingOptions,
        giftReceiptProps,
        printedCardProps,
        printedCardPrice,
        giftMessageCheckboxProps,
        giftMessageResult,
        hasGiftMessage,
        showGiftMessageResult,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        editGiftMessageButtonProps,
        cancelGiftMessageButtonProps,
        saveGiftMessageButtonProps,
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
                            defaultMessage: 'Include gift receipt'
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

    const includeGiftMessage =
        allow_order === '1' ? (
            <>
                <div className={classes.option}>
                    <div className={classes.checkboxContainer}>
                        <Checkbox
                            {...giftMessageCheckboxProps}
                            data-cy="GiftOptions-includeGiftMessage"
                            label={formatMessage({
                                id: 'giftOptions.includeGiftMessage',
                                defaultMessage: 'Optional Message'
                            })}
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
                            ? classes.giftMessageResultContainer
                            : classes.hidden
                    }
                >
                    <div
                        className={classes.giftMessageResult}
                        data-cy="GiftOptions-giftMessageResult"
                    >
                        <p>
                            <FormattedMessage
                                id="giftOptions.giftMessageTo"
                                defaultMessage="<strong>To:</strong> {cardTo}"
                                values={{
                                    cardTo: giftMessageResult.cardTo,
                                    strong: chunks => <strong>{chunks}</strong>
                                }}
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id="giftOptions.giftMessageFrom"
                                defaultMessage="<strong>From:</strong> {cardFrom}"
                                values={{
                                    cardFrom: giftMessageResult.cardFrom,
                                    strong: chunks => <strong>{chunks}</strong>
                                }}
                            />
                        </p>
                        <p>{giftMessageResult.cardMessage}</p>
                    </div>

                    <LinkButton
                        {...editGiftMessageButtonProps}
                        classes={{ root: classes.editGiftMessageButton }}
                        data-cy="GiftOptions-editGiftMessageButton"
                    >
                        <Icon
                            classes={{ icon: null }}
                            size={16}
                            src={EditIcon}
                        />
                        <span className={classes.actionLabel}>
                            <FormattedMessage
                                id="giftOptions.editGiftMessageButton"
                                defaultMessage="Edit"
                            />
                        </span>
                    </LinkButton>
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
                    <Field
                        id="message"
                        label={formatMessage({
                            id: 'giftOptions.message',
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

                    <div className={classes.giftMessageActions}>
                        {hasGiftMessage ? (
                            <Button
                                {...cancelGiftMessageButtonProps}
                                data-cy="GiftOptions-cancelGiftMessageButton"
                            >
                                <FormattedMessage
                                    id="giftOptions.cancelGiftMessageButton"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                        ) : null}
                        <Button
                            {...saveGiftMessageButtonProps}
                            data-cy="GiftOptions-updateGiftMessageButton"
                        >
                            {hasGiftMessage ? (
                                <FormattedMessage
                                    id="giftOptions.updateGiftMessageButton"
                                    defaultMessage="Update Message"
                                />
                            ) : (
                                <FormattedMessage
                                    id="giftOptions.addGiftMessage"
                                    defaultMessage="Add Message"
                                />
                            )}
                        </Button>
                    </div>
                </div>
            </>
        ) : null;

    const includePrintedCard =
        allow_printed_card === '1' ? (
            <div className={classes.option}>
                <div className={classes.checkboxContainer}>
                    <Checkbox
                        {...printedCardProps}
                        data-cy="GiftOptions-includePrintedCard"
                        label={formatMessage(
                            {
                                id: 'giftOptions.includePrintedCard',
                                defaultMessage: 'Add printed card{price}'
                            },
                            {
                                price:
                                    printedCardPrice &&
                                    printedCardPrice.value > 0 ? (
                                        <>
                                            {' ( + '}
                                            <Price
                                                currencyCode={
                                                    printedCardPrice.currency
                                                }
                                                value={printedCardPrice.value}
                                            />
                                            {')'}
                                        </>
                                    ) : null
                            }
                        )}
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

    return (
        <Form
            data-cy="GiftOptions-form"
            {...optionsFormProps}
            className={classes.root}
        >
            <FormError errors={Array.from(errors.values())} />
            {includeGiftReceipt}
            {includeGiftMessage}
            {includePrintedCard}
        </Form>
    );
};

export default GiftOptions;
