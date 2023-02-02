import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';

/**
 * The useMyAccount talon complements the MyAccount component.
 *
 * @param {Object}      props
 * @param {Function}    props.onSignOut - a function to call when the user signs out.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - A callback function to attach to the sign out button.
 */
export const useMyAccount = props => {
    const { onSignOut } = props;

    const [, { closeDrawer }] = useAppContext();
    const location = useLocation();
    const shouldCloseDrawer = useRef(false);

    const handleSignOut = useCallback(() => {
        closeDrawer();
        onSignOut();
    }, [closeDrawer, onSignOut]);

    // Whenever the page changes, close the drawer.
    useEffect(() => {
        // The very first time MyAccount renders, this effect is fired.
        // Don't close the drawer on that occasion, but do so every time
        // location changes thereafter.
        if (shouldCloseDrawer.current) {
            closeDrawer();
        } else {
            shouldCloseDrawer.current = true;
        }
    }, [closeDrawer, location.key]);

    return {
        handleSignOut
    };
};
