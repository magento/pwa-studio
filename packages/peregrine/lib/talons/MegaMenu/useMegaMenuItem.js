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

    const KEY_ESCAPE = 27;
    const KEY_SPACE = 32;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_SHIFT = 9;

    const a11yClick = e => {
        //checking down arrow or space
        if (e.keyCode === KEY_SPACE || e.keyCode === KEY_DOWN) {
            return true;
        }
        //checking up arrow or escape
        if (e.keyCode === KEY_UP || e.keyCode === KEY_ESCAPE) {
            setIsFocused(false);
        }
        //checking Tab with Shift
        if (e.keyCode == KEY_SHIFT && e.shiftKey) {
            setIsFocused(false);
        }
    };

    const toggleSubMenu = e => {
        e.preventDefault();
        if (
            category.children.length &&
            !(e.keyCode === KEY_UP || e.keyCode === KEY_ESCAPE)
        ) {
            setIsFocused(true);
        } else {
            setIsFocused(false);
        }
    };

    return {
        isFocused,
        isActive,
        handleCloseSubMenu,
        isMenuActive,
        a11yClick,
        toggleSubMenu
    };
};
