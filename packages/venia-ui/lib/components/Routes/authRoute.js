import React from 'react';
import { bool, node, string } from 'prop-types';
import { Redirect, Route, useLocation } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

const AuthRoute = props => {
    const { authed, redirectTo, children, ...rest } = props;
    const { pathname } = useLocation();
    const [{ isSignedIn }] = useUserContext();

    if (authed && !isSignedIn) {
        return (
            <Redirect
                to={{
                    pathname: redirectTo,
                    // Keep path in memory to redirect user there when signed in
                    state: { from: pathname }
                }}
            />
        );
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
