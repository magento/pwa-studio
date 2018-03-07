import { createElement, Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { string, func, object } from 'prop-types';
import MagentoRouteHandler from './MagentoRouteHandler';

export default class MagentoRouter extends Component {
    static propTypes = {
        /* Can be BrowserRouter, MemoryRouter, HashRouter, etc */
        using: func,
        routerProps: object,
        apiBase: string.isRequired,
        __tmp_webpack_public_path__: string.isRequired
    };

    static defaultProps = {
        using: BrowserRouter,
        routerProps: {}
    };

    render() {
        const {
            using: Router,
            routerProps,
            apiBase,
            __tmp_webpack_public_path__
        } = this.props;

        return (
            <Router {...routerProps}>
                <Route
                    render={({ location }) => (
                        <MagentoRouteHandler
                            location={location}
                            apiBase={apiBase}
                            __tmp_webpack_public_path__={
                                __tmp_webpack_public_path__
                            }
                        />
                    )}
                />
            </Router>
        );
    }
}
