import React from 'react';

import { promptStates, useGiftCardPrompt } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCardPrompt';
import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCardPrompt.css';

const GiftCardPrompt = props => {
    const { numCards } = props;

    const talonProps = useGiftCardPrompt({ numCards });
    const { promptState } = talonProps;
    
    const classes = mergeClasses(defaultClasses, props.classes);
    
    const contents = promptState === promptStates.ADD ? (
        <span>+ Add another gift card</span>
    ) : (
        <span>Enter gift card info & check balance & stuff</span>
    )

    return (
        <div className={classes.root}>
            { contents }
        </div>
    )

};

export default GiftCardPrompt;