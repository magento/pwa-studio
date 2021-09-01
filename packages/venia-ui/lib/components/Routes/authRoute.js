import React from 'react';
import { bool, node } from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

const AuthRoute = props => {
    const { authed, children, ...rest } = props;
    const [{ isSignedIn }] = useUserContext();

    if (authed && !isSignedIn) {
        return <Redirect to="/" />;
    }

    return <Route {...rest}>{children}</Route>;
};

AuthRoute.defaultProps = {
    authed: false
};

AuthRoute.propTypes = {
    authed: bool,
    children: node
};

export default AuthRoute;
