import { useCallback, useState } from 'react';

export const useSection = props => {
    const { isOpenExternal } = props;

    const [isOpen, setIsOpen] = useState(isOpenExternal);

    const handleClick = useCallback(() => {
        // toggle the section open or closed.
        setIsOpen(!isOpen);
    }, [isOpen]);

    return {
        handleClick,
        isOpen
    };
};
