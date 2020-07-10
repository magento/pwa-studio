import { useCallback } from 'react';

export const useMyAccount = props => {
    const { onSignOut } = props;

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);

    return {
        handleSignOut
    };
};
