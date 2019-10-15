import React, { useEffect } from 'react';

import { User as UserIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine';

const icon = <Icon src={UserIcon} attrs={{ width: 18 }} />;
/**
 * An extension that displays a welcome message when the user signs in.
 */
export const WelcomeToast = () => {
    const [{ currentUser }] = useUserContext();
    const [, { addToast }] = useToasts();
    const { firstname, lastname } = currentUser;

    const signedIn = !!firstname;
    useEffect(() => {
        if (signedIn) {
            addToast({
                type: 'info',
                icon,
                message: `Welcome ${firstname} ${lastname}`,
                timeout: 3000
            });
        }
    }, [addToast, signedIn, firstname, lastname]);
    return <></>;
};
