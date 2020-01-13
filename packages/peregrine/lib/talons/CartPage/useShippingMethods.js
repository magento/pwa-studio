import { useCallback } from 'react';

export const useShippingMethods = () => {
    const handleSubmit = useCallback(() => {
        alert('Submit!');
    }, []);

    return {
        handleSubmit
    };
};
