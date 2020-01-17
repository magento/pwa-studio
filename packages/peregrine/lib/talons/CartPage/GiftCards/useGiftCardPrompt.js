import { useCallback, useState } from 'react';
import { useFormState } from 'informed';

export const promptStates = {
    ADD: 'add',
    ENTERING: 'entering'
};

export const useGiftCardPrompt = props => {
    const { numCards } = props;

    const initialPromptState = numCards === 0 ? promptStates.ENTERING : promptStates.ADD;
    const [promptState, setPromptState] = useState(initialPromptState);

    const formState = useFormState();
    // TODO: why is this an empty object?
    console.log('formState', formState);

    const togglePromptState = useCallback(() => {
        setPromptState(prevState => {
            switch(prevState) {
                case promptStates.ADD: {
                    return promptStates.ENTERING;
                }
                case promptStates.ENTERING:
                default: {
                    return promptStates.ADD;
                }
            }
        });
    }, []);

    const handleApplyCard = useCallback(() => {
        const cardCode = formState.values['card'];
        console.log('Applying card', cardCode);
    }, [formState]);

    const handleCheckBalance = useCallback(() => {
        const cardCode = formState.values['card'];
        console.log('Checking balance of card', cardCode);
    }, [formState]);

    return {
        promptState,
        handleApplyCard,
        handleCheckBalance,
        togglePromptState
    };
}
