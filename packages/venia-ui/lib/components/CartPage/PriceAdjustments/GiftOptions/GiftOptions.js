import React, { useState, useCallback, Fragment } from 'react';
import debounce from 'lodash.debounce';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';

const useToggle = () => {
    const [flag, setFlag] = useState(false);

    const toggleFlag = () => {
        setFlag(!flag);
    };

    return [flag, toggleFlag];
};

const useGiftOptions = () => {
    const [includeGiftReceipt, toggleIncludeGitReceipt] = useToggle(true);
    const [includePrintedCard, toggleIncludePrintedCard] = useToggle(false);
    const [giftMessage, setGiftMessage] = useState('');

    const updateGiftMessage = useCallback(
        newGiftMessage => {
            setGiftMessage(newGiftMessage);
            debounce(console.log, 5000);
        },
        [setGiftMessage]
    );

    return [
        { includeGiftReceipt, includePrintedCard, giftMessage },
        { toggleIncludeGitReceipt, toggleIncludePrintedCard, updateGiftMessage }
    ];
};

const GiftOptions = () => {
    const [
        { includeGiftReceipt, includePrintedCard, giftMessage },
        { toggleIncludeGitReceipt, toggleIncludePrintedCard, updateGiftMessage }
    ] = useGiftOptions();

    const setGiftMessage = useCallback(
        e => {
            console.log(e.target.value);
            updateGiftMessage(e.target.value);
        },
        [updateGiftMessage]
    );

    return (
        <Fragment>
            <Checkbox
                id="includeGiftReceipt"
                field="includeGiftReceipt"
                label="Include gift receipt"
                fieldState={{
                    value: includeGiftReceipt
                }}
                onClick={toggleIncludeGitReceipt}
            />
            <Checkbox
                id="includePrintedCard"
                field="includePrintedCard"
                label="Include printed card"
                fieldState={{ value: includePrintedCard }}
                onClick={toggleIncludePrintedCard}
            />
            <TextArea
                id="cardMessage"
                field="cardMessage"
                placeholder="Enter your message here"
                /**
                 * TODO need to give initial value or give
                 * value to render when needed
                 */
                onChange={setGiftMessage}
            />
        </Fragment>
    );
};

export default GiftOptions;
