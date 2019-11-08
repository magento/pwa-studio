import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import MagentoRoute from '../MagentoRoute';

const CreateAccountPage = lazy(() => import('../CreateAccountPage'));
const Search = lazy(() => import('../../RootComponents/Search'));

const LOADING_MESSAGE = 'Just a moment...';
const fallback = <h1>{LOADING_MESSAGE}</h1>;

const Routes = () => {
    return (
        <Suspense fallback={fallback}>
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
