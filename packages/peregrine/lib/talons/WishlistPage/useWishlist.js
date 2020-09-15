import { useCallback, useState } from 'react';

export const useWishlist = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    const handleActionMenuClick = useCallback(() => {
        console.log('To be handled by PWA-632');
    }, []);

    return {
        handleActionMenuClick,
        handleContentToggle,
        isOpen
    };
};
