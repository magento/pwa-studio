import { useCallback } from 'react';

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

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);

    return {
        handleSignOut
    };
};
