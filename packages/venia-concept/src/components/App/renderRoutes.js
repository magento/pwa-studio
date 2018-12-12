import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Page } from '@magento/peregrine';
import ErrorView from 'src/components/ErrorView/index';
import CreateAccountPage from 'src/components/CreateAccountPage/index';
import Search from 'src/RootComponents/Search';

const renderRoutingError = props => <ErrorView {...props} />;
const search = () => <Search />;

const renderRoutes = () => (
    <Switch>
        <Route exact path="/search.html">
            <Page>{search}</Page>
        </Route>
        <Route exact path="/create-account" component={CreateAccountPage} />
        <Route render={() => <Page>{renderRoutingError}</Page>} />
    </Switch>
);

export default renderRoutes;
