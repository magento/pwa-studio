import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/app';

const GROUP_LOADING_DELAY = 750;

export default () => {
    const [{ isPageLoading }] = useAppContext();
    const doneTimeoutRef = useRef();
    const [loadingState, setLoadingState] = useState('off');

    useEffect(() => {
        if (isPageLoading) {
            setLoadingState('loading');
        } else if (
            typeof clearTimeout !== 'undefined' &&
            typeof setTimeout !== 'undefined'
        ) {
            setLoadingState('done');

            if (doneTimeoutRef && doneTimeoutRef.current !== null) {
                clearTimeout(doneTimeoutRef.current);
            }

            doneTimeoutRef.current = setTimeout(() => {
                setLoadingState(currentLoadingState => {
                    if (currentLoadingState === 'loading') {
                        return 'loading';
                    }

                    return 'off';
                });
            }, GROUP_LOADING_DELAY);
        } else {
            setLoadingState('off');
        }

        return () => {
            if (
                typeof clearTimeout !== 'undefined' &&
                doneTimeoutRef &&
                doneTimeoutRef.current !== null
            ) {
                clearTimeout(doneTimeoutRef.current);
            }
        };
    }, [isPageLoading, doneTimeoutRef]);

    return {
        isPageLoading,
        loadingState
    };
};
