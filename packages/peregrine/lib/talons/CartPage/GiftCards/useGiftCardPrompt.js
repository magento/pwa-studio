import { useCallback, useRef, useState, useEffect } from 'react';

export const promptStates = {
    ADD: 'add',
    ENTERING: 'entering'
};

export const useGiftCardPrompt = props => {
    const { numCards, setShouldDisplayCardBalance } = props;

    const canCloseForm = numCards > 0;

    const initialPromptState =
        numCards === 0 ? promptStates.ENTERING : promptStates.ADD;
    const [promptState, setPromptState] = useState(initialPromptState);

    const togglePromptState = useCallback(() => {
        setPromptState(prevState => {
            switch (prevState) {
                case promptStates.ADD: {
                    return promptStates.ENTERING;
                }
                case promptStates.ENTERING:
                default: {
                    return promptStates.ADD;
                }
            }
        });

        setShouldDisplayCardBalance(false);
    }, [setShouldDisplayCardBalance]);

    useEffect(() => {
        if (numCards === 0) {
            setPromptState(promptStates.ENTERING);
        }
    }, [numCards]);

    return {
        canCloseForm,
        promptState,
        togglePromptState
    };
};
