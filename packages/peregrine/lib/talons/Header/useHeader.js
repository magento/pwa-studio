import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

export const useHeader = () => {
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();
    const {
        elementRef: searchRef,
        expanded: isSearchOpen,
        setExpanded: setIsSearchOpen,
        triggerRef: searchTriggerRef
    } = useDropdown();

    const location = useLocation();

    const isOnSearchPage = location.pathname === '/search.html';

    // Don't show the header search input on the search page,
    // it has its own.
    useEffect(() => {
        if (isOnSearchPage) {
            setIsSearchOpen(false);
        }
    }, [isOnSearchPage, setIsSearchOpen]);

    const handleSearchTriggerClick = useCallback(() => {
        if (isOnSearchPage) {
            // The search page has its own input,
            // purposefully do not show the one from the header.
            return;
        }

        // Toggle the Search input form.
        setIsSearchOpen(isOpen => !isOpen);
    }, [isOnSearchPage, setIsSearchOpen]);

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    };
};
