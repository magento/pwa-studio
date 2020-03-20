import { useMemo } from 'react';

export const displayStates = {
    ACTIVE: 'active',
    FINISHED: 'finished',
    QUEUED: 'queued'
};

export const useShippingMethod = props => {
    const { doneEditing, showContent } = props;

    const displayState = useMemo(() => {
        if (!showContent) return displayStates.QUEUED;
        if (doneEditing) return displayStates.FINISHED;
        return displayStates.ACTIVE;
    }, [doneEditing, showContent]);

    return {
        displayState
    };
};
