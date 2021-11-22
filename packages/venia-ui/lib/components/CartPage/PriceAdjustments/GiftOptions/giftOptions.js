import React from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';

import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Checkbox from '../../../Checkbox';
import Field from '../../../Field';
import FormError from '../../../FormError';
import LoadingIndicator from '../../../LoadingIndicator';
import TextArea from '../../../TextArea';
import TextInput from '../../../TextInput';

import defaultClasses from './giftOptions.module.css';

/**
 * A child component of the PriceAdjustments component.
 * This component displays the form for adding gift options.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * @param {Boolean} props.shouldSubmit property telling us to submit data
 * @param {Object} props.giftOptionsConfigData config data
 * See [giftOptions.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import GiftOptions from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions";
 */
const GiftOptions = props => {
    const { classes: propClasses, shouldSubmit } = props;
    const {
        loading,
        errors,
        giftReceiptProps,
        printedCardProps,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        optionsFormProps
    } = useGiftOptions({
        shouldSubmit
    });
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
                <Checkbox
                    {...giftReceiptProps}
                    data-cy="GiftOptions-includeGiftReceipt"
                    label={formatMessage({
                        id: 'giftOptions.includeGiftReceipt',
                        defaultMessage: 'Include gift receipt'
                    })}
                />
            </div>
        ) : null;

    const includePrintedCard =
        allow_printed_card === '1' ? (
            <div className={classes.option}>
                <Checkbox
                    {...printedCardProps}
                    data-cy="GiftOptions-includePrintedCard"
                    label={formatMessage({
                        id: 'giftOptions.includePrintedCard',
                        defaultMessage: 'Include printed card'
                    })}
                />
            </div>
        ) : null;

    const includeGiftMessage =
        allow_order === '1' ? (
            <>
                <Field
                    id="to"
                    label={formatMessage({
                        id: 'giftOptions.to',
                        defaultMessage: 'To'
                    })}
                >
                    <TextInput {...cardToProps} data-cy="GiftOptions-cardTo" />
                </Field>
                <Field
                    id="from"
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
            </>
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
