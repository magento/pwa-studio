import React, { Component, createContext } from 'react';
import { func, object, shape, string } from 'prop-types';

export const { Consumer, Provider } = createContext();

export default class MagentoRouter extends Component {
    static propTypes = {
        apiBase: string.isRequired,
        routerProps: object,
        using: shape({
            Route: func.isRequired,
            Router: func.isRequired // e.g., BrowserRouter, MemoryRouter
        }).isRequired
    };

    static defaultProps = {
        routerProps: {}
    };

    render() {
        const {
            apiBase,
            children,
            routerProps,
            using: { Route, Router }
        } = this.props;

        return (
            <Router {...routerProps}>
                <Route>
                    {routeProps => (
                        <Provider value={{ apiBase, ...routeProps }}>
                            {children}
                        </Provider>
                    )}
                </Route>
            </Router>
        );
    }
}
