import React from 'react';
import { node, string } from 'prop-types';
import { Redirect, Route, useLocation } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

const AuthRoute = props => {
    const { redirectTo, children, ...rest } = props;
    const { pathname } = useLocation();
    const [{ isSignedIn }] = useUserContext();

    if (!isSignedIn) {
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
    redirectTo: '/'
};

AuthRoute.propTypes = {
    redirectTo: string,
    children: node
};

export default AuthRoute;
