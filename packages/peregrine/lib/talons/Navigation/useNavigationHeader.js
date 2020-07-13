import { useCallback } from 'react';

export const useNavigationHeader = props => {
    const { isTopLevel, onBack, view } = props;

    const isTopLevelMenu = isTopLevel && view === 'MENU';

    const handleBack = useCallback(() => {
        onBack();
    }, [onBack]);

    return {
        handleBack,
        isTopLevelMenu
    };
};
