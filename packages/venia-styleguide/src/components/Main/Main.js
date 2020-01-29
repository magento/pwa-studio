import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MDXAdapter from '../MDXAdapter';
import Page from './Page';
import classes from './Main.css';

const Main = () => {
    return (
        <main className={classes.root}>
            <MDXAdapter>
                <Switch>
                    <Route path="/page/:slug">
                        <Page />
                    </Route>
                    <Route>Home page</Route>
                </Switch>
            </MDXAdapter>
        </main>
    );
};

export default Main;
