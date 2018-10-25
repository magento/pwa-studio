import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Page } from '@magento/peregrine';

import classify from 'src/classify';
import ErrorView from 'src/components/ErrorView';
import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import defaultClasses from './appShell.css';

const handleRoutingError = props => <ErrorView {...props} />;

class AppShell extends Component {
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
                    <Page>{handleRoutingError}</Page>
                </Main>
                <Mask isActive={overlay} dismiss={closeDrawer} />
                <Navigation isOpen={navIsOpen} />
                <MiniCart isOpen={cartIsOpen} />
            </div>
        );
    }
}

export default classify(defaultClasses)(AppShell);
