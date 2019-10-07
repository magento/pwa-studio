import { useCallback } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useHeader = () => {
    const [
        { hasBeenOffline, isOnline, searchOpen },
        { toggleSearch }
    ] = useAppContext();

    const handleSearchTriggerClick = useCallback(() => {
        toggleSearch();
    }, [toggleSearch]);

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        searchOpen
    };
};
