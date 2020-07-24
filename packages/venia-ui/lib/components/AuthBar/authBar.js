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
            className={classes.button}
            disabled={isDisabled}
            onClick={handleShowMyAccount}
        >
            <span className={classes.contents}>
                <AccountChip fallbackText={'Account'} />
                <span className={classes.icon}>
                    <Icon src={ArrowRightIcon} />
                </span>
            </span>
        </button>
    ) : (
        // Sign In button.
        <button
            className={classes.button}
            disabled={isDisabled}
            onClick={handleSignIn}
        >
            <span className={classes.contents}>
                <AccountChip fallbackText={'Account'} />
                <span className={classes.signIn}>{`Sign In`}</span>
            </span>
        </button>
    );

    return <div className={classes.root}>{buttonElement}</div>;
};

export default AuthBar;

AuthBar.propTypes = {
    classes: shape({
        root: string,
        button: string,
        contents: string,
        icon: string,
        signIn: string
    }),
    disabled: bool,
    showMyAccount: func.isRequired,
    showSignIn: func.isRequired
};
