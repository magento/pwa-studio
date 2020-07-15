import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { ArrowRight as ArrowRightIcon } from 'react-feather';

import { useAuthBar } from '@magento/peregrine/lib/talons/AuthBar/useAuthBar';

import { mergeClasses } from '../../classify';
import AccountChip from '../AccountChip';
import Icon from '../Icon';
import defaultClasses from './authBar.css';

const AuthBar = props => {
    const {
        handleShowMyAccount,
        handleSignIn,
        isDisabled,
        isUserSignedIn
    } = useAuthBar(props);

    const classes = mergeClasses(defaultClasses, props.classes);

    const buttonElement = isUserSignedIn ? (
        // Show My Account button.
        <button
            className={classes.contents}
            disabled={isDisabled}
            onClick={handleShowMyAccount}
        >
            <AccountChip fallbackText={'Account'} />
            <span className={classes.icon}>
                <Icon src={ArrowRightIcon} />
            </span>
        </button>
    ) : (
        // Sign In button.
        <button
            className={classes.contents}
            disabled={isDisabled}
            onClick={handleSignIn}
        >
            <AccountChip fallbackText={'Account'} />
            <span className={classes.signIn}>{`Sign In`}</span>
        </button>
    );

    return <div className={classes.root}>{buttonElement}</div>;
};

export default AuthBar;

AuthBar.propTypes = {
    classes: shape({
        root: string,
        account: string,
        contents: string,
        icon: string,
        message: string,
        signIn: string
    }),
    disabled: bool,
    showMyAccount: func.isRequired,
    showSignIn: func.isRequired
};
