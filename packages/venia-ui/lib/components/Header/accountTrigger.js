import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';
import AccountChip from '../AccountChip';
import AccountMenu from '../AccountMenu';
import defaultClasses from './accountTrigger.css';

const AccountTrigger = props => {
    const talonProps = useAccountTrigger({
        mutations: { signOut: SIGN_OUT_MUTATION }
    });
    const {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        handleSignOut,
        handleTriggerClick,
        isUserSignedIn
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = accountMenuIsOpen ? classes.root_open : classes.root;

    return (
        <Fragment>
            <div className={rootClassName} ref={accountMenuTriggerRef}>
                <button
                    aria-label={'Toggle My Account Menu'}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                >
                    <AccountChip fallbackText={'Sign In'} />
                </button>
            </div>
            <AccountMenu
                handleSignOut={handleSignOut}
                isOpen={accountMenuIsOpen}
                isUserSignedIn={isUserSignedIn}
                ref={accountMenuRef}
            />
        </Fragment>
    );
};

export default AccountTrigger;

AccountTrigger.propTypes = {
    classes: shape({
        root: string,
        root_open: string
    })
};
