import React, { useMemo } from 'react';
import { useKeyboard } from 'react-aria';

export const useSubMenu = props => {
    const { isFocused, subMenuState, handleCloseSubMenu } = props;

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (e.keyCode == 9 && !e.shiftKey) {
                e.target.addEventListener('blur', handleCloseSubMenu());
            }
        }
    });

    const isSubMenuActive = useMemo(() => {
        if (isFocused) {
            if (subMenuState) {
                return true;
            }
        }
        return false;
    }, [isFocused, subMenuState]);

    return { keyboardProps, isSubMenuActive };
};
