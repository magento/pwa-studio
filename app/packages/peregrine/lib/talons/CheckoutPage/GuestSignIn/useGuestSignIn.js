import { useCallback, useState } from 'react';

export const useGuestSignIn = props => {
    const { toggleActiveContent } = props;
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

    const handleBackToCheckout = useCallback(() => {
        toggleActiveContent();
        setView('SIGNIN');
    }, [toggleActiveContent]);

    return {
        handleBackToCheckout,
        toggleCreateAccountView,
        toggleForgotPasswordView,
        view
    };
};
