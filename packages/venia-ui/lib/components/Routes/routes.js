import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import MagentoRoute from '../MagentoRoute';

const CreateAccountPage = lazy(() => import('../CreateAccountPage'));
const Search = lazy(() => import('../../RootComponents/Search'));

const Routes = () => {
    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                <Route exact path="/search.html">
                    <Search />
                </Route>
                <Route exact path="/create-account">
                    <CreateAccountPage />
                </Route>
                <Route>
                    <MagentoRoute />
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
