import React, { Component, createContext } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { func, object, string } from 'prop-types';

export const { Consumer, Provider } = createContext();

export default class MagentoRouter extends Component {
    static propTypes = {
        apiBase: string.isRequired,
        routerProps: object,
        using: func // e.g., BrowserRouter, MemoryRouter
    };

    static defaultProps = {
        routerProps: {},
        using: BrowserRouter
    };

    render() {
        const { apiBase, children, routerProps, using: Router } = this.props;

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
