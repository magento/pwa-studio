import { createElement, Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { string, func, object } from 'prop-types';
import MagentoRouteHandler from './MagentoRouteHandler';

export default class MagentoRouter extends Component {
    static propTypes = {
        /* Can be BrowserRouter, MemoryRouter, HashRouter, etc */
        using: func,
        routerProps: object,
        apiBase: string.isRequired
    };

    static defaultProps = {
        using: BrowserRouter,
        routerProps: {}
    };

    render() {
        const { using: Router, routerProps, apiBase } = this.props;

        return (
            <Router {...routerProps}>
                <Route
                    render={({ location }) => (
                        <MagentoRouteHandler
                            location={location}
                            apiBase={apiBase}
                        />
                    )}
                />
            </Router>
        );
    }
}
