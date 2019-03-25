import React, { useCallback } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { ChevronUp as ChevronUpIcon } from 'react-feather';

import { mergeClasses } from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import UserInformation from 'src/components/MyAccountMenuPage/UserInformation';
import defaultClasses from './authBar.css';

const AuthBar = props => {
    const { disabled, onSignIn, onViewAccount, user, userIsSignedIn } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const signIn = useCallback(() => {
        onSignIn();
    }, [onSignIn]);

    const child = userIsSignedIn ? (
        <button type="button" onClick={onViewAccount}>
            <UserInformation user={user} />
            <Icon src={ChevronUpIcon} />
        </button>
    ) : (
        <Button disabled={!!disabled} priority="high" onClick={signIn}>
            {'Sign In'}
        </Button>
    );

    return <div className={classes.root}>{child}</div>;
};

export default AuthBar;

AuthBar.propTypes = {
    classes: shape({
        root: string
    }),
    disabled: bool,
    onSignIn: func.isRequired,
    onViewAccount: func.isRequired,
    userIsSignedIn: bool
};
