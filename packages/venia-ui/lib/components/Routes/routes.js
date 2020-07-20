import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import HomePage from '../HomePage';
import MagentoRoute from '../MagentoRoute';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';

const Routes = () => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);

    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                <Route>
                    <MagentoRoute />
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
