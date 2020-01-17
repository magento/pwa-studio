import React from 'react';
import { Form } from 'informed';

import { promptStates, useGiftCardPrompt } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCardPrompt';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import Field from '../../Field';
import TextInput from '../../TextInput';
import defaultClasses from './giftCardPrompt.css';

const GiftCardPrompt = props => {
    const { numCards } = props;

    const talonProps = useGiftCardPrompt({ numCards });
    const { promptState, handleApplyCard, handleCheckBalance, togglePromptState } = talonProps;
    
    const classes = mergeClasses(defaultClasses, props.classes);
    
    // const contents = promptState === promptStates.ADD ? (
    const contents = false ? (
        <Button onClick={togglePromptState}>+ Add another gift card</Button>
    ) : (
        <Form>
            <div className={classes.card}>
                <Field label="Gift Card Number">
                    <div className={classes.card_input}>
                        <TextInput id={classes.card} field="card" />
                        <Button type="submit" onClick={handleApplyCard}>Apply</Button>
                        <Button onClick={togglePromptState}>X</Button>
                    </div>
                    <Button type="submit" onClick={handleCheckBalance}>Check Gift Card balance</Button>
                </Field>
            </div>
        </Form>
    );

    return (
        <div className={classes.root}>
            { contents }
        </div>
    )

};

export default GiftCardPrompt;