import React from 'react';
import { Form } from 'informed';
import { X as CloseIcon } from 'react-feather';

import {
    promptStates,
    useGiftCardPrompt
} from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCardPrompt';

import { mergeClasses } from '../../../classify';
import Field from '../../Field';
import Icon from '../../Icon';
import TextInput from '../../TextInput';
import Trigger from '../../Trigger';
import ApplyButton from './applyButton';
import CheckBalanceButton from './checkBalanceButton';
import defaultClasses from './giftCardPrompt.css';

const GiftCardPrompt = props => {
    const { numCards } = props;

    const talonProps = useGiftCardPrompt({ numCards });
    const { promptState, togglePromptState } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const contents =
        promptState === promptStates.ADD ? (
            <button
                className={classes.show_entry}
                onClick={togglePromptState}
            >
                {`+ Add another gift card`}
            </button>
        ) : (
            <Form>
                <div className={classes.card}>
                    <Field classes={{ root: classes.entry }} id={classes.card} label="Gift Card Number">
                        <div className={classes.card_input}>
                            <TextInput id={classes.card} field="card" />
                            <ApplyButton />
                            <Trigger action={togglePromptState}>
                                <Icon src={CloseIcon} />
                            </Trigger>
                        </div>
                        <CheckBalanceButton />
                    </Field>
                </div>
            </Form>
        );

    return <div className={classes.root}>{contents}</div>;
};

export default GiftCardPrompt;
