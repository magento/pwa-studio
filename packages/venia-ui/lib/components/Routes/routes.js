import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import MagentoRoute from '../MagentoRoute';

const CartPage = lazy(() => import('../CartPage'));
const CheckoutPage = lazy(() => import('../CheckoutPage'));
const CreateAccountPage = lazy(() => import('../CreateAccountPage'));
const Search = lazy(() => import('../../RootComponents/Search'));

import { useLocation } from 'react-router-dom';
import { useLocalization } from '@magento/peregrine';

const Routes = () => {
    const [ localizationState, {handleSwitchLang, _t}] = useLocalization(); // Absolunet
    const { currentLocale, currentStoreView, availableLangs } = localizationState;
    const { pathname } = useLocation();
    const localeCode = pathname.match(/^\/[a-z]{2}_{1}[a-z]{2}/);

    if (localeCode.length > 0) {
        const urlLocale = localeCode[0].substring(1);
        availableLangs.forEach(function (lang){
            if (urlLocale == lang && lang !== currentLocale) {
                handleSwitchLang(lang);
            }
        });
    }

    const SubRoutes = ({ match }) => (
        <Switch>
            <Route exact path={`${match.url}/search.html`}>
                <Search />
            </Route>
            <Route exact path={`${match.url}/create-account`}>
                <CreateAccountPage />
            </Route>
            <Route exact path={`${match.url}/cart`}>
                <CartPage />
            </Route>
            <Route path={`${match.url}`}>
                <MagentoRoute />
            </Route>
        </Switch>
      );
    
    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                {availableLangs.map(lang => (
                    <Route id={`${lang}.parent`} path={`/${lang}`} onEnter={() => store.dispatch(handleSwitchLang(`${lang}`))} component={SubRoutes}></Route>
                ))}
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
