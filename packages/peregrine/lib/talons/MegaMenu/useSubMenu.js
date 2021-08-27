import { useMemo } from 'react';
import { useKeyboard } from 'react-aria';

export const useSubMenu = props => {
    const { isFocused, subMenuState, handleCloseSubMenu } = props;

    const KEY_SHIFT = 9;

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (e.keyCode == KEY_SHIFT && !e.shiftKey) {
                e.target.addEventListener('blur', handleCloseSubMenu());
            }
        }
    });

    const isSubMenuActive = useMemo(() => {
        return isFocused && subMenuState;
    }, [isFocused, subMenuState]);

    return { keyboardProps, isSubMenuActive };
};
