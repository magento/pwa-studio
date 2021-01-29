import React from 'react';
import { useIntl } from 'react-intl';

import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import { mergeClasses } from '../../../../classify';
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
        includeGiftReceipt,
        includePrintedCard,
        giftMessage,
        toggleIncludeGiftReceiptFlag,
        toggleIncludePrintedCardFlag,
        updateGiftMessage
    } = useGiftOptions({ ...GiftOptionsOperations });
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <ul className={classes.option}>
                <Checkbox
                    id="includeGiftReceipt"
                    field="includeGiftReceipt"
                    label={formatMessage({
                        id: 'giftOptions.includeGiftReceipt',
                        defaultMessage: 'Include gift receipt'
                    })}
                    fieldState={{
                        value: includeGiftReceipt
                    }}
                    onClick={toggleIncludeGiftReceiptFlag}
                />
            </ul>
            <ul className={classes.option}>
                <Checkbox
                    id="includePrintedCard"
                    field="includePrintedCard"
                    label={formatMessage({
                        id: 'giftOptions.includePrintedCard',
                        defaultMessage: 'Include printed card'
                    })}
                    fieldState={{
                        value: includePrintedCard
                    }}
                    onClick={toggleIncludePrintedCardFlag}
                />
            </ul>
            <ul className={classes.option}>
                {includePrintedCard && (
                    <TextArea
                        id="cardMessage"
                        field="cardMessage"
                        placeholder={formatMessage({
                            id: 'giftOptions.cardMessage',
                            defaultMessage: 'Enter your message here'
                        })}
                        initialValue={giftMessage}
                        onChange={updateGiftMessage}
                    />
                )}
            </ul>
        </div>
    );
};

export default GiftOptions;
