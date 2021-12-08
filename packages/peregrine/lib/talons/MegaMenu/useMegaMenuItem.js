import { useCallback, useMemo, useState } from 'react';

export const useMegaMenuItem = props => {
    const { category, activeCategoryId, subMenuState, disableFocus } = props;

    const [isFocused, setIsFocused] = useState(false);
    const isActive = category.id === activeCategoryId;

    const handleMenuItemFocus = useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const handleCloseSubMenu = useCallback(() => {
        setIsFocused(false);
    }, [setIsFocused]);

    const isMenuActive = useMemo(() => {
        if (!isFocused) {
            return false;
        }
        if (subMenuState) {
            return true;
        } else if (disableFocus) {
            setIsFocused(false);
        }
        return false;
    }, [isFocused, subMenuState, disableFocus]);

    const handleKeyDown = useCallback(
        event => {
            const { key: pressedKey, shiftKey } = event;

            // checking down arrow and spacebar
            if (pressedKey === 'ArrowDown' || pressedKey === ' ') {
                event.preventDefault();
                if (category.children.length) {
                    setIsFocused(true);
                } else {
                    setIsFocused(false);
                }

                return;
            }

            //checking up arrow or escape
            if (pressedKey === 'ArrowUp' || pressedKey === 'Escape') {
                setIsFocused(false);
            }

            //checking Tab with Shift
            if (shiftKey && pressedKey === 'Tab') {
                setIsFocused(false);
            }
        },
        [category.children.length]
    );

    return {
        isFocused,
        isActive,
        handleMenuItemFocus,
        handleCloseSubMenu,
        isMenuActive,
        handleKeyDown
    };
};
