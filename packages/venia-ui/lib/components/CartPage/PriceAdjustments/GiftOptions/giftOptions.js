import GiftOptionsOperations from '@magento/peregrine/lib/talons/CartPage/GiftOptions/giftOptions.gql';
import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';
import { Form, Relevant } from 'informed';
import React from 'react';
import { useIntl } from 'react-intl';
import { useStyle } from '../../../../classify';
import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
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
        shouldPromptForMessage
    } = useGiftOptions({ ...GiftOptionsOperations });
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Form {...optionsFormProps} className={classes.root}>
            <div className={classes.option}>
                <Checkbox
                    {...giftReceiptProps}
                    label={formatMessage({
                        id: 'giftOptions.includeGiftReceipt',
                        defaultMessage: 'Include gift receipt'
                    })}
                />
            </div>
            <div className={classes.option}>
                <Checkbox
                    {...printedCardProps}
                    label={formatMessage({
                        id: 'giftOptions.includePrintedCard',
                        defaultMessage: 'Include printed card'
                    })}
                />
            </div>
            <div className={classes.option}>
                <Relevant when={shouldPromptForMessage}>
                    <TextArea
                        {...cardMessageProps}
                        placeholder={formatMessage({
                            id: 'giftOptions.cardMessage',
                            defaultMessage: 'Enter your message here'
                        })}
                    />
                </Relevant>
            </div>
        </Form>
    );
};

export default GiftOptions;
