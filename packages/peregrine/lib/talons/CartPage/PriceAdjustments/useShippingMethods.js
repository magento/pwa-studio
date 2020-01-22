import { useCallback, useState } from 'react';

export const shippingMethodSteps = {
    COLLECTING_ADDRESS: 'address',
    COLLECTING_METHODS: 'methods'
};

export const useShippingMethods = () => {
    const [step, setStep] = useState(shippingMethodSteps.COLLECTING_ADDRESS);

    const handleSubmit = useCallback(() => {
        alert('submit!');
    }, []);

    return {
        handleSubmit,
        setStep,
        step
    }
};
