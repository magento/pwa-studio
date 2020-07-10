import { useCallback } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useNavigationHeader = props => {
    const { isTopLevel, onBack, view } = props;

    const [{ currentUser }, { isSignedIn: isUserSignedIn }] = useUserContext();

    const isTopLevelMenu = isTopLevel && view === 'MENU';

    const handleBack = useCallback(() => {
        onBack();
    }, [onBack]);

    return {
        currentUser,
        handleBack,
        isTopLevelMenu,
        isUserSignedIn
    };
};
