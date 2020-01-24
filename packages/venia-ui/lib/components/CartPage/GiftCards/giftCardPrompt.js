import React from 'react';
import { Form } from 'informed';
import { X as CloseIcon } from 'react-feather';

import {
    promptStates,
    useGiftCardPrompt
} from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCardPrompt';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Field from '../../Field';
import Icon from '../../Icon';
import TextInput from '../../TextInput';
import Trigger from '../../Trigger';
import ApplyButton from './applyButton';
import CheckBalanceButton from './checkBalanceButton';
import defaultClasses from './giftCardPrompt.css';

const GiftCardPrompt = props => {
    const { applyCardResult, balanceResult, handleApplyCard, handleCheckCardBalance, numCards, setShouldDisplayCardBalance, shouldDisplayCardBalance } = props;

    const talonProps = useGiftCardPrompt({ numCards, setShouldDisplayCardBalance });
    const { canCloseForm, promptState, togglePromptState } = talonProps;

    const isApplying = applyCardResult.loading;
    const isCheckingBalance = balanceResult.loading;

    const classes = mergeClasses(defaultClasses, props.classes);

    const addStateContents = (
        <button
            className={classes.show_entry}
            onClick={togglePromptState}
        >
            {`+ Add another gift card`}
        </button>
    );

    const enteringStateContents = (
        <Form>
            <div className={classes.card}>
                <Field classes={{ root: classes.entry }} id={classes.card} label="Gift Card Number">
                    <div className={classes.card_input}>
                        <TextInput id={classes.card} disabled={isApplying || isCheckingBalance} field="card" />
                        <ApplyButton disabled={isApplying} handleApplyCard={handleApplyCard} />
                        { canCloseForm && (
                            <Trigger action={togglePromptState}>
                                <Icon src={CloseIcon} />
                            </Trigger>
                        )}
                    </div>
                </Field>
                { shouldDisplayCardBalance && (
                    <div className={classes.balance}>
                        <span>{balanceResult.data.giftCardAccount.code}</span>
                        <span className={classes.price}>
                            {`Balance: `}
                            <Price
                                value={balanceResult.data.giftCardAccount.balance.value}
                                currencyCode={balanceResult.data.giftCardAccount.balance.currency}
                            />
                        </span>
                    </div>
                )}
                <CheckBalanceButton disabled={isCheckingBalance} handleCheckCardBalance={handleCheckCardBalance} />
            </div>
        </Form>
    );

    const contents = promptState === promptStates.ADD ? addStateContents : enteringStateContents;

    return <div className={classes.root}>{contents}</div>;
};

export default GiftCardPrompt;
