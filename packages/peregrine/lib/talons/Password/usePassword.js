import { useState, useCallback } from 'react';

export const usePassword = () => {
    const [visible, setVisbility] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
        setVisbility(!visible);
    }, [visible]);

    return {
        visible,
        togglePasswordVisibility
    };
};
