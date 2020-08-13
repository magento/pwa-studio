import { useCallback } from 'react';

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
    const { onSignOut, onClose } = props;

    const [, { closeDrawer }] = useAppContext();

    const handleClick = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    const handleSignOut = useCallback(() => {
        closeDrawer();
        onSignOut();
    }, [closeDrawer, onSignOut]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return {
        handleClick,
        handleSignOut
    };
};
