import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Page } from '@magento/peregrine';

import classify from 'src/classify';
import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import defaultClasses from './appShell.css';

// TODO: make this its own, more sophisticated component
const ErrorHandler = ({ loading, notFound }) => {
    const text = loading
        ? 'Loading...'
        : notFound
            ? '404 Not Found'
            : '500 Internal Server Error';

    return <h1>{text}</h1>;
};

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
                    <Page>{ErrorHandler}</Page>
                </Main>
                <Mask isActive={overlay} dismiss={closeDrawer} />
                <Navigation isOpen={navIsOpen} />
                <MiniCart isOpen={cartIsOpen} />
            </div>
        );
    }
}

export default classify(defaultClasses)(AppShell);
