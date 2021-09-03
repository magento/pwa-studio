import React from 'react';
import { bool, node, string } from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

const AuthRoute = props => {
    const { authed, redirectTo, children, ...rest } = props;
    const [{ isSignedIn }] = useUserContext();

    if (authed && !isSignedIn) {
        return <Redirect to={redirectTo} />;
    }

    return <Route {...rest}>{children}</Route>;
};

AuthRoute.defaultProps = {
    authed: false,
    redirectTo: '/'
};

AuthRoute.propTypes = {
    authed: bool,
    redirectTo: string,
    children: node
};

export default AuthRoute;
