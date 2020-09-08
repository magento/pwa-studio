import { useCallback, useState } from 'react';

export const useOrderRow = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    return {
        isOpen,
        handleContentToggle
    };
};
