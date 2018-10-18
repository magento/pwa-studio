import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CreateAccountPage from 'src/components/CreateAccountPage';

const renderRoutes = ({ magentoRoute }) => (
    <Switch>
        <Route exact path="/create-account" component={CreateAccountPage} />
        {magentoRoute}
    </Switch>
);

export default renderRoutes;
