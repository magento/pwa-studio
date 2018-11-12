import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { func, object, string } from 'prop-types';
import MagentoRouteHandler from './MagentoRouteHandler';

export default class MagentoRouter extends Component {
    static propTypes = {
        apiBase: string.isRequired,
        routerProps: object,
        using: func, // e.g., BrowserRouter, MemoryRouter
        renderRoutes: func,
        renderMagentoRoutingError: func
    };

    static defaultProps = {
        routerProps: {},
        using: BrowserRouter,
        renderRoutes: ({ magentoRoute }) => magentoRoute
    };

    render() {
        const {
            apiBase,
            routerProps,
            using: Router,
            renderRoutes,
            renderMagentoRoutingError
        } = this.props;

        return (
            <Router {...routerProps}>
                {renderRoutes({
                    magentoRoute: (
                        <Route>
                            {routeProps => (
                                <MagentoRouteHandler
                                    {...routeProps}
                                    apiBase={apiBase}
                                    renderRoutingError={
                                        renderMagentoRoutingError
                                    }
                                />
                            )}
                        </Route>
                    )
                })}
            </Router>
        );
    }
}
