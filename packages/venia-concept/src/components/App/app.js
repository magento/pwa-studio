import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Page } from '@magento/peregrine';

import classify from 'src/classify';
import ErrorView from 'src/components/ErrorView';
import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import OnlineIndicator from 'src/components/OnlineIndicator';
import defaultClasses from './app.css';

const renderRoutingError = props => <ErrorView {...props} />;

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

    get onlineIndicator() {
        const { app } = this.props;
        const { hasBeenOffline, isOnline } = app;

        // Only show online indicator when
        // online after being offline
        return hasBeenOffline ? <OnlineIndicator isOnline={isOnline} /> : null;
    }

    render() {
        const { app, classes, closeDrawer } = this.props;
        const { onlineIndicator } = this;
        const { drawer, overlay } = app;
        const navIsOpen = drawer === 'nav';
        const cartIsOpen = drawer === 'cart';
        const className = overlay ? classes.root_masked : classes.root;

        return (
            <div className={className}>
                <Main isMasked={overlay}>
                    {onlineIndicator}
                    <Page>{renderRoutingError}</Page>
                </Main>
                <Mask isActive={overlay} dismiss={closeDrawer} />
                <Navigation isOpen={navIsOpen} />
                <MiniCart isOpen={cartIsOpen} />
            </div>
        );
    }
}

export default classify(defaultClasses)(App);
