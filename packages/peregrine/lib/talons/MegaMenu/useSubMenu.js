import { useKeyboard } from 'react-aria';

export const useSubMenu = props => {
    const { isFocused, subMenuState, handleMenuItemFocus } = props;

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (!e.shiftKey && e.key === 'Tab') {
                e.target.addEventListener('blur', handleMenuItemFocus);
            } else {
                e.target.removeEventListener('blur', handleMenuItemFocus);
            }
        }
    });

    const isSubMenuActive = isFocused && subMenuState;

    return { keyboardProps, isSubMenuActive };
};
