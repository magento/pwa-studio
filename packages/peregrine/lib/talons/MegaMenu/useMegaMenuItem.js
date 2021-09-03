import { useCallback, useMemo, useState } from 'react';

export const useMegaMenuItem = props => {
    const { category, activeCategoryId, subMenuState, disableFocus } = props;

    const [isFocused, setIsFocused] = useState(false);
    const isActive = category.id === activeCategoryId;

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

    const a11yClick = e => {
        //checking down arrow
        if (e.key === 'ArrowDown' || e.key === ' ') {
            return true;
        }
        //checking up arrow or escape
        if (e.key === 'ArrowUp' || e.key === 'Escape') {
            setIsFocused(false);
        }
        //checking Tab with Shift
        if (e.shiftKey && e.key === 'Tab') {
            setIsFocused(false);
        }
    };

    const toggleSubMenu = e => {
        e.preventDefault();
        if (
            category.children.length &&
            !(e.key === 'ArrowUp' || e.key === 'Escape')
        ) {
            setIsFocused(true);
        } else {
            setIsFocused(false);
        }
    };

    const handleKeyDown = e => {
        a11yClick(e) && toggleSubMenu(e);
    };

    return {
        isFocused,
        isActive,
        handleCloseSubMenu,
        isMenuActive,
        handleKeyDown
    };
};
