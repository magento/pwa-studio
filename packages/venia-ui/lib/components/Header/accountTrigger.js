import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { Loader, User as MyAccountIcon } from 'react-feather';

import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import AccountMenu from '../AccountMenu';
import Icon from '../Icon';
import defaultClasses from './accountTrigger.css';

const AccountTrigger = props => {
    const {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        handleTriggerClick,
        isLoadingUserName,
        isUserSignedIn,
        welcomeMessage
    } = useAccountTrigger();

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = accountMenuIsOpen ? classes.root_open : classes.root;
    const triggerText = isLoadingUserName ? (
        <Icon classes={{ icon: classes.loader }} src={Loader} />
    ) : (
        welcomeMessage
    );

    return (
        <Fragment>
            <div className={rootClassName} ref={accountMenuTriggerRef}>
                <button
                    aria-label={'Toggle My Account Menu'}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                >
                    <Icon src={MyAccountIcon} />
                    {triggerText}
                </button>
            </div>
            <AccountMenu
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
