import { useState } from 'react';

export const promptStates = {
    ADD: 'add',
    ENTERING: 'entering'
};

export const useGiftCardPrompt = props => {
    const { numCards } = props;

    const initialPromptState = numCards === 0 ? promptStates.ENTERING : promptStates.ADD;
    const [promptState, setPromptState] = useState(initialPromptState);

    return {
        promptState,
        setPromptState
    };
}
