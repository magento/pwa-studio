import { useMemo } from 'react';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing',
    QUEUED: 'queued'
};

export const useShippingMethod = props => {
    const { doneEditing, showContent } = props;

    const displayState = useMemo(() => {
        if (!showContent) return displayStates.QUEUED;
        if (doneEditing) return displayStates.DONE;
        return displayStates.EDITING;
    }, [doneEditing, showContent]);

    return {
        displayState
    };
};
