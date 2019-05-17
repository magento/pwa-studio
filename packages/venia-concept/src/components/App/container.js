import React, { Component } from 'react';
import { connect } from 'src/drivers';

import appActions, { closeDrawer } from 'src/actions/app';
import App from './app';

class AppContainer extends Component {
    static get initialState() {
        return {
            renderError: null
        };
    }

    static getDerivedStateFromError(renderError) {
        return { renderError };
    }

    state = AppContainer.initialState;

    render() {
        const { renderError } = this.state;
        return <ConnectedApp renderError={renderError} />;
    }
}

const mapStateToProps = ({ app, unhandledErrors }) => ({
    app,
    unhandledErrors
});

const { markErrorHandled } = appActions;
const mapDispatchToProps = { closeDrawer, markErrorHandled };

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer;
