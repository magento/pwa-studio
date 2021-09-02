import { useKeyboard } from 'react-aria';

export const useSubMenu = props => {
    const { isFocused, subMenuState, handleCloseSubMenu } = props;

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (!e.shiftKey && e.key === 'Tab') {
                e.target.addEventListener('blur', handleCloseSubMenu);
            } else {
                e.target.removeEventListener('blur', handleCloseSubMenu);
            }
        }
    });

    const isSubMenuActive = isFocused && subMenuState;

    return { keyboardProps, isSubMenuActive };
};
