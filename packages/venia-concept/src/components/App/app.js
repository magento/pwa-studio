import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { bool, func, shape, string } from 'prop-types';
import { Page } from '@magento/peregrine';

import Search from 'src/RootComponents/Search';
import classify from 'src/classify';
import ErrorView from 'src/components/ErrorView';
import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import defaultClasses from './app.css';

const renderRoutingError = props => <ErrorView {...props} />;
const search = () => <Search />;

class App extends Component {
    static propTypes = {
        app: shape({
            drawer: string,
            overlay: bool.isRequired
        }).isRequired,
        classes: shape({
            root: string,
            root_masked: string
        }),
        closeDrawer: func.isRequired
    };

    render() {
        const { app, classes, closeDrawer } = this.props;
        const { drawer, overlay } = app;
        const navIsOpen = drawer === 'nav';
        const cartIsOpen = drawer === 'cart';
        const className = overlay ? classes.root_masked : classes.root;

        return (
            <div className={className}>
                <Main isMasked={overlay}>
                    <Switch>
                        <Route exact path="/search.html">
                            <Page>{search}</Page>
                        </Route>
                        <Route>
                            <Page>{renderRoutingError}</Page>
                        </Route>
                    </Switch>
                </Main>
                <Mask isActive={overlay} dismiss={closeDrawer} />
                <Navigation isOpen={navIsOpen} />
                <MiniCart isOpen={cartIsOpen} />
            </div>
        );
    }
}

export default classify(defaultClasses)(App);
