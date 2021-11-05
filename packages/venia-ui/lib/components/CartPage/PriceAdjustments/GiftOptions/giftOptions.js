import React from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions.js';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import Field from '../../../Field';
import TextInput from '../../../TextInput';
import defaultClasses from './giftOptions.module.css';
import LoadingIndicator from '../../../LoadingIndicator';

/**
 * A child component of the PriceAdjustments component.
 * This component displays the form for adding gift options.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [giftOptions.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import GiftOptions from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions";
 */
const GiftOptions = props => {
    const {
        loading,
        giftReceiptProps,
        printedCardProps,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        optionsFormProps
    } = useGiftOptions();
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

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
                    <TextInput {...cardToProps} />
                </Field>
                <Field
                    id="from"
                    label={formatMessage({
                        id: 'giftOptions.from',
                        defaultMessage: 'From'
                    })}
                >
                    <TextInput {...cardFromProps} />
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
            {includeGiftReceipt}
            {includePrintedCard}
            {includeGiftMessage}
        </Form>
    );
};

export default GiftOptions;
