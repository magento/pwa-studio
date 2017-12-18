import { createElement, Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { arrayOf, shape, string, func, object } from 'prop-types';
import UnknownRouteResolver from './UnknownRouteResolver';
import RenderComponentForRoute from './RenderComponentForRoute';

export default class MagentoRouter extends Component {
    static propTypes = {
        // Note: Initial list of standard routes will likely be
        // hardcoded into this lib. Just accepting a prop for now
        routes: arrayOf(
            shape({
                urlPattern: string.isRequired,
                getComponent: func.isRequired
            })
        ),
        /* () => React.Element<any> */
        render404: func.isRequired,
        /* (err: Error) => React.Element<any> */
        renderRouteError: func.isRequired,
        /* (route: string) => Promise<string> */
        resolveUnknownRoute: func.isRequired,
        /* () => React.Element<any> */
        renderLoading: func,
        /* Can be BrowserRouter, MemoryRouter, HashRouter, etc */
        Router: func,
        routerProps: object
    };

    static defaultProps = {
        Router: BrowserRouter,
        routerProps: {}
    };

    state = {
        lazyRoutes: []
    };

    registerRoute = route => {
        this.setState(prevState => ({
            lazyRoutes: [...prevState.lazyRoutes, route]
        }));
    };

    render() {
        const {
            routes,
            render404,
            renderRouteError,
            resolveUnknownRoute,
            renderLoading,
            Router,
            routerProps
        } = this.props;
        const { lazyRoutes } = this.state;

        return (
            <Router {...routerProps}>
                <Switch>
                    {routes
                        .concat(lazyRoutes)
                        .map(route => (
                            <Route
                                key={route.urlPattern}
                                path={route.urlPattern}
                                render={routeProps => (
                                    <RenderComponentForRoute
                                        routeProps={routeProps}
                                        route={route}
                                        renderLoading={renderLoading}
                                        renderRouteError={renderRouteError}
                                    />
                                )}
                            />
                        ))}
                    <Route
                        render={({ location = {} }) => (
                            <UnknownRouteResolver
                                routes={routes}
                                pathname={location.pathname || ''}
                                resolveUnknownRoute={resolveUnknownRoute}
                                registerRoute={this.registerRoute}
                                render404={render404}
                                renderRouteError={renderRouteError}
                            />
                        )}
                    />
                </Switch>
            </Router>
        );
    }
}
