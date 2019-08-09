import React, { useCallback, useContext } from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Button from 'src/components/Button';
import UserInformation from 'src/components/MyAccountMenuPage/UserInformation';
import { UserContext } from '../Navigation';
import defaultClasses from './authBar.css';

const AuthBar = props => {
    const { disabled, showMyAccount, showSignIn } = props;

    const [{ currentUser, isSignedIn }] = useContext(UserContext);
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        showSignIn();
    }, [showSignIn]);

    const child = isSignedIn ? (
        <UserInformation user={currentUser} showMyAccount={showMyAccount} />
    ) : (
        <Button disabled={!!disabled} priority="high" onClick={handleClick}>
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
    showMyAccount: func.isRequired,
    showSignIn: func.isRequired
};
