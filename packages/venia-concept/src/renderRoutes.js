import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Page from 'src/components/Page';
import CreateAccountPage from 'src/components/CreateAccountPage';

const renderRoutes = ({ magentoRoute }) => (
    <Page>
        <Switch>
            <Route exact path="/create-account" component={CreateAccountPage} />
            {magentoRoute}
        </Switch>
    </Page>
);

export default renderRoutes;
