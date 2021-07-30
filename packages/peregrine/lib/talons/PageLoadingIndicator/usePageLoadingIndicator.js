import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/app';

export default () => {
    const [{ isPageLoading }] = useAppContext();
    const doneTimeoutRef = useRef();
    const [loadingState, setLoadingState] = useState('off');

    useEffect(() => {
        if (isPageLoading) {
            setLoadingState('loading');
        } else if (typeof clearTimeout !== 'undefined' && typeof setTimeout !== 'undefined') {
            setLoadingState('done');

            if (doneTimeoutRef && doneTimeoutRef.current !== null) {
                clearTimeout(doneTimeoutRef.current);
            }

            doneTimeoutRef.current = setTimeout(() => {
                setLoadingState((currentLoadingState) => {
                    if (currentLoadingState === 'loading') {
                        return 'loading';
                    }

                    return 'off';
                });
            }, 750);
        } else {
            setLoadingState('off');
        }
    }, [isPageLoading, doneTimeoutRef]);

    return {
        isPageLoading,
        loadingState
    };
};
