import { useCallback } from 'react';

/**
 * Returns props necessary to render a UserChip component.
 *
 * @param {object} props
 * @param {function} props.showMyAccount - callback that shows my account
 * @param {object} props.user - user object
 * @return {{ display: string, email: string, handleClick: function }}
 */
export const useUserChip = props => {
    const { showMyAccount, user } = props;
    const { email, firstname, lastname } = user || {};
    const fullname = `${firstname} ${lastname}`;
    const display = fullname.trim() || 'Loading...';

    const handleClick = useCallback(() => {
        showMyAccount();
    }, [showMyAccount]);

    return {
        display,
        email,
        handleClick
    };
};
