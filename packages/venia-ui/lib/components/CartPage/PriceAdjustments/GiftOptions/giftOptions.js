import React from 'react';

import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import { mergeClasses } from '../../../../classify';
import GiftOptionsOperations from './giftOptions.gql';
import defaultClasses from './giftOptions.css';

/**
 * Component that displays the Gift Options forms.
 * 
 * @param {Object} props Component props
 * @param {Object} props.classes CSS className overrides.
 * See [giftOptions.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.css}
 * for a list of classes you can override.
 * 
 * @returns {React.Element} A React component that displays the Gift Options forms.
 */
const GiftOptions = props => {
    const {
        includeGiftReceipt,
        includePrintedCard,
        giftMessage,
        toggleIncludeGiftReceiptFlag,
        toggleIncludePrintedCardFlag,
        updateGiftMessage
    } = useGiftOptions({
        ...GiftOptionsOperations
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <ul className={classes.option}>
                <Checkbox
                    id="includeGiftReceipt"
                    field="includeGiftReceipt"
                    label="Include gift receipt"
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
                    label="Include printed card"
                    fieldState={{ value: includePrintedCard }}
                    onClick={toggleIncludePrintedCardFlag}
                />
            </ul>
            <ul className={classes.option}>
                {includePrintedCard && (
                    <TextArea
                        id="cardMessage"
                        field="cardMessage"
                        placeholder="Enter your message here"
                        initialValue={giftMessage}
                        onChange={updateGiftMessage}
                    />
                )}
            </ul>
        </div>
    );
};

export default GiftOptions;
