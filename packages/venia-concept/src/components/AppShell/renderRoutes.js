import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Page } from '@magento/peregrine';
import ErrorView from 'src/components/ErrorView';
import CreateAccountPage from 'src/components/CreateAccountPage';

const renderRoutingError = props => <ErrorView {...props} />;

const renderRoutes = () => (
    <Switch>
        <Route exact path="/create-account" component={CreateAccountPage} />
        <Route render={() => <Page>{renderRoutingError}</Page>} />
    </Switch>
);

export default renderRoutes;
