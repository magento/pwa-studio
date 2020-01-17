import React from 'react';

import { promptStates, useGiftCardPrompt } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCardPrompt';
import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './giftCardPrompt.css';

const GiftCardPrompt = props => {
    const { numCards } = props;

    const talonProps = useGiftCardPrompt({ numCards });
    const { promptState, togglePromptState } = talonProps;
    
    const classes = mergeClasses(defaultClasses, props.classes);
    
    const contents = promptState === promptStates.ADD ? (
        <Button onClick={togglePromptState}>+ Add another gift card</Button>
    ) : (
        <div>
            <span>Enter gift card info & check balance & stuff</span>
            <Button onClick={togglePromptState}>X</Button>
        </div>
    );

    return (
        <div className={classes.root}>
            { contents }
        </div>
    )

};

export default GiftCardPrompt;