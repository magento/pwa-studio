import React, { Suspense, lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import MagentoRoute from '../MagentoRoute';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';

const CartPage = lazy(() => import('../CartPage'));
const CheckoutPage = lazy(() => import('../CheckoutPage'));
const CreateAccountPage = lazy(() => import('../CreateAccountPage'));
const Search = lazy(() => import('../../RootComponents/Search'));

const Routes = () => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);

    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                <Route exact path="/search.html">
                    <Search />
                </Route>
                <Route exact path="/create-account">
                    <CreateAccountPage />
                </Route>
                <Route exact path="/cart">
                    <CartPage />
                </Route>
                <Route exact path="/checkout">
                    <CheckoutPage />
                </Route>
                <Route>
                    <MagentoRoute />
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
