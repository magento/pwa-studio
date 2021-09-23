import React from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';
import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import Field from '../../../Field';
import TextInput from '../../../TextInput';
import { useStyle } from '../../../../classify';
import GiftOptionsOperations from './giftOptions.gql';
import defaultClasses from './giftOptions.css';

/**
 * A child component of the PriceAdjustments component.
 * This component displays the form for adding gift options.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [giftOptions.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import GiftOptions from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions";
 */
const GiftOptions = props => {
    const {
        cardMessageProps,
        giftReceiptProps,
        optionsFormProps,
        printedCardProps,
        fromProps,
        toProps
    } = useGiftOptions({ ...GiftOptionsOperations });
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const { allow_gift_receipt, allow_printed_card } =
        props?.wrappingConfigData || {};

    const includeGiftReceipt =
        allow_gift_receipt === '1' ? (
            <div className={classes.option}>
                <Checkbox
                    {...giftReceiptProps}
                    label={formatMessage({
                        id: 'giftOptions.includeGiftReceipt',
                        defaultMessage: 'Include gift receipt'
                    })}
                />
            </div>
        ) : (
            ''
        );

    const includePrintedCard =
        allow_printed_card === '1' ? (
            <>
                <div className={classes.option}>
                    <Checkbox
                        {...printedCardProps}
                        label={formatMessage({
                            id: 'giftOptions.includePrintedCard',
                            defaultMessage: 'Include printed card'
                        })}
                    />
                </div>
            </>
        ) : (
            ''
        );

    return (
        <Form {...optionsFormProps} className={classes.root}>
            {includeGiftReceipt}
            {includePrintedCard}

            <Field
                id="to"
                label={formatMessage({
                    id: 'giftOptions.to',
                    defaultMessage: 'To'
                })}
            >
                <TextInput {...toProps} />
            </Field>
            <Field
                id="from"
                label={formatMessage({
                    id: 'giftOptions.from',
                    defaultMessage: 'From'
                })}
            >
                <TextInput {...fromProps} />
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
                        placeholder={formatMessage({
                            id: 'giftOptions.cardMessage',
                            defaultMessage: 'Enter your message here'
                        })}
                    />
                </Field>
            </div>
        </Form>
    );
};

export default GiftOptions;
