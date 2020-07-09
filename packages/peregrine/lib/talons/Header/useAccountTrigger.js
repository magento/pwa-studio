import { useCallback, useRef } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

export const useAccountTrigger = () => {
    const {
        elementRef: accountMenuRef,
        expanded: accountMenuIsOpen,
        setExpanded: setAccountMenuIsOpen
    } = useDropdown();

    const [{ currentUser, isSignedIn: isUserSignedIn }] = useUserContext();

    // Yuck.
    // This is here - hopefully temporarily - because you can't close the
    // dropdown without it. 
    // useDropdown intercepts the click outside of its ref (the AccountMenu),
    // and closes the AccountMenu.
    // Then the handleTriggerClick callback is called and it opens it again.
    const shouldListen = useRef(true);

    const welcomeMessage = isUserSignedIn ? `Hi, ${currentUser.firstname}` : `Sign In`;

    const handleTriggerClick = useCallback(() => {
        if (shouldListen.current === true) {
            // Open the Account Menu.
            setAccountMenuIsOpen(true);
        }

        shouldListen.current = !shouldListen.current;
    }, [setAccountMenuIsOpen]);

    return {
        accountMenuIsOpen,
        accountMenuRef,
        handleTriggerClick,
        isUserSignedIn,
        welcomeMessage
    };
};
