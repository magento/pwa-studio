import React from 'react';
import { func, shape, string } from 'prop-types';

import { useMyAccount } from '@magento/peregrine/lib/talons/MyAccount/useMyAccount';

import { useStyle } from '../../classify';
import AccountMenuItems from '../AccountMenu/accountMenuItems';
import defaultClasses from './myAccount.module.css';

const MyAccount = props => {
    const { classes: propClasses, onSignOut, onClose } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useMyAccount({
        onSignOut: onSignOut,
        onClose: onClose
    });
    const { handleSignOut, handleClose } = talonProps;

    return (
        <div className={classes.root}>
            <AccountMenuItems onSignOut={handleSignOut} onClose={handleClose} />
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
