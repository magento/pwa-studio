import { useCallback } from 'react';

const titles = {
    CREATE_ACCOUNT: 'Create Account',
    FORGOT_PASSWORD: 'Forgot Password',
    MY_ACCOUNT: 'My Account',
    SIGN_IN: 'Sign In',
    MENU: 'Main Menu'
};

export const useNavigationHeader = props => {
    const { isTopLevel, onBack, onClose, view } = props;

    const title = titles[view] || titles.MENU;
    const isTopLevelMenu = isTopLevel && view === 'MENU';

    const handleBack = useCallback(() => {
        onBack();
    }, [onBack]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return {
        handleClose,
        handleBack,
        isTopLevelMenu,
        title
    };
};
