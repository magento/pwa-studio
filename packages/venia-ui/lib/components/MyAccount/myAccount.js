import React from 'react';
import { Archive as HistoryIcon, LogOut as SignOutIcon } from 'react-feather';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import AccountLink from './accountLink';
import defaultClasses from './myAccount.css';
import { useMyAccount } from '@magento/peregrine/lib/talons/MyAccount/useMyAccount';

const PURCHASE_HISTORY = 'Purchase History';
const SIGN_OUT = 'Sign Out';

const MyAccount = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useMyAccount({
        onSignOut: props.onSignOut
    });

    const { handleSignOut, subtitle, title } = talonProps;

    return (
        <div className={classes.root}>
            <div className={classes.user}>
                <h2 className={classes.title}>{title}</h2>
                <span className={classes.subtitle}>{subtitle}</span>
            </div>
            <div className={classes.actions}>
                <AccountLink>
                    <HistoryIcon size={18} />
                    {PURCHASE_HISTORY}
                </AccountLink>
                <AccountLink onClick={handleSignOut}>
                    <SignOutIcon size={18} />
                    {SIGN_OUT}
                </AccountLink>
            </div>
        </div>
    );
};

export default MyAccount;

MyAccount.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    }),
    onSignOut: func.isRequired
};
