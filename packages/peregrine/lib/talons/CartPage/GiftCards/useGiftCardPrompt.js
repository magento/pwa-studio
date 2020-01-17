import { useCallback, useState } from 'react';

export const promptStates = {
    ADD: 'add',
    ENTERING: 'entering'
};

export const useGiftCardPrompt = props => {
    const { numCards } = props;

    const initialPromptState = numCards === 0 ? promptStates.ENTERING : promptStates.ADD;
    const [promptState, setPromptState] = useState(initialPromptState);

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

    return {
        promptState,
        togglePromptState
    };
}
