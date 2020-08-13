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
    const isFirstTime = useRef(true);

    const handleSignOut = useCallback(() => {
        closeDrawer();
        onSignOut();
    }, [closeDrawer, onSignOut]);

    // Whenever the page changes (after the first one), close the drawer.
    useEffect(() => {
        if (!isFirstTime.current) {
            closeDrawer();
        } else {
            isFirstTime.current = false;
        }
    }, [closeDrawer, location.key]);

    return {
        handleSignOut
    };
};
