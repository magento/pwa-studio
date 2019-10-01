import { useCallback } from 'react';

export const useNavigationHeader = props => {
    const { isTopLevel, onBack, onClose, view } = props;

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
        isTopLevelMenu
    };
};
