import React, { Component, createContext } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { func, object, shape, string } from 'prop-types';

export const { Consumer, Provider } = createContext();

export default class MagentoRouter extends Component {
    static propTypes = {
        config: shape({
            apiBase: string.isRequired,
            __tmp_webpack_public_path__: string.isRequired
        }).isRequired,
        routerProps: object,
        using: func // e.g., BrowserRouter, MemoryRouter
    };

    static defaultProps = {
        routerProps: {},
        using: BrowserRouter
    };

    render() {
        const { children, config, routerProps, using: Router } = this.props;

        return (
            <Router {...routerProps}>
                <Route>
                    {routeProps => (
                        <Provider value={{ ...config, ...routeProps }}>
                            {children}
                        </Provider>
                    )}
                </Route>
            </Router>
        );
    }
}
