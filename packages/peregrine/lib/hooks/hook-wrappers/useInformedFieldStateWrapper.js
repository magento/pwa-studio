import { useState, useEffect } from 'react';
import { useFieldState } from 'informed';

const useInformedFieldStateWrapper = field => {
    const [isInitialRender, setIsInitialRender] = useState(true);
    const warn = console.warn;
    // Temporarily override console warn to remove false positive warning from useFieldState
    const regex = /^Attempting to get field (.*) but it does not exist$/g;
    if (isInitialRender) {
        console.warn = err => {
            if (!err.match(regex)) {
                warn(err);
            }
        };
    }
    useEffect(() => {
        setIsInitialRender(false);
    }, []);
    const fieldState = useFieldState(field);
    if (isInitialRender) {
        console.warn = warn;
    }

    return fieldState;
};

export default useInformedFieldStateWrapper;
