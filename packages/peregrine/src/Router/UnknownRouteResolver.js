import { createElement, Component } from 'react';
import { func, arrayOf, shape, string } from 'prop-types';
import { matchPath } from 'react-router';

export default class UnknownRouteResolver extends Component {
    static propTypes = {
        routes: arrayOf(
            shape({
                urlPattern: string.isRequired,
                getComponent: func.isRequired
            })
        ).isRequired,
        pathname: string.isRequired,
        /* (route: string) => string */
        resolveUnknownRoute: func.isRequired,
        /* (route: object) => void */
        registerRoute: func.isRequired,
        /* () => React.Element<any> */
        render404: func.isRequired,
        /* (err: Error) => React.Element<any> */
        renderRouteError: func.isRequired
    };

    componentDidMount() {
        this.handleRoute(this.props.pathname);
    }

    handleRoute(url) {
        const {
            resolveUnknownRoute,
            renderRouteError,
            routes,
            registerRoute,
            render404
        } = this.props;
        resolveUnknownRoute(url)
            .then(stdRoute => {
                // Find route definition matching the standard route,
                // so we can determine what root component to render
                const route = routes.find(route => {
                    return matchPath(stdRoute, {
                        path: route.urlPattern,
                        strict: true,
                        exact: true
                    });
                });

                registerRoute({
                    getComponent: route ? route.getComponent : () => render404,
                    urlPattern: url
                });
            })
            .catch(err => {
                registerRoute({
                    getComponent: () => () => renderRouteError(err),
                    urlPattern: url
                });
            });
    }

    render() {
        return null;
    }
}
