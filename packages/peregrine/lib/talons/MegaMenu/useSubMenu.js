import { useKeyboard } from 'react-aria';

export const useSubMenu = props => {
    const { isFocused, subMenuState, handleMenuItemBlur } = props;

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (!e.shiftKey && e.key === 'Tab') {
                e.target.addEventListener('blur', handleMenuItemBlur);
            } else {
                e.target.removeEventListener('blur', handleMenuItemBlur);
            }
        }
    });

    const isSubMenuActive = isFocused && subMenuState;

    return { keyboardProps, isSubMenuActive };
};
