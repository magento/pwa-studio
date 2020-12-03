import { useCallback, useState } from 'react';

export const useGuestSignIn = () => {
    const [view, setView] = useState('SIGNIN');

    const toggleForgotPasswordView = useCallback(() => {
        setView(currentView =>
            currentView === 'SIGNIN' ? 'FORGOT_PASSWORD' : 'SIGNIN'
        );
    }, []);

    const toggleCreateAccountView = useCallback(() => {
        setView(currentView =>
            currentView === 'SIGNIN' ? 'CREATE_ACCOUNT' : 'SIGNIN'
        );
    }, []);

    return {
        toggleCreateAccountView,
        toggleForgotPasswordView,
        view
    };
};
