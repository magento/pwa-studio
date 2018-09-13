import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import resolveUnknownRoute from './resolveUnknownRoute';
import fetchRootComponent from './fetchRootComponent';

// TODO: accept user-defined components
const Loading = () => <div>Loading</div>;
const NotFound = () => <h1>404 Not Found</h1>;
const InternalError = () => <h1>500 Internal Error</h1>;

export default class MagentoRouteHandler extends Component {
    static propTypes = {
        apiBase: string.isRequired,
        __tmp_webpack_public_path__: string.isRequired,
        location: shape({
            pathname: string.isRequired
        }).isRequired
    };

    state = {};

    componentDidMount() {
        this.getRouteComponent(this.props.location.pathname);
    }

    componentDidUpdate() {
        const { location } = this.props;
        const { pathname } = location;
        const isKnown = this.state.hasOwnProperty(pathname);

        if (!isKnown) {
            this.getRouteComponent(pathname);
        }
    }

    getRouteComponent(pathname) {
        const { apiBase, __tmp_webpack_public_path__ } = this.props;

        resolveUnknownRoute({
            route: pathname,
            apiBase,
            __tmp_webpack_public_path__
        })
            .then(({ id, matched, rootChunkID, rootModuleID }) => {
                if (!matched) {
                    throw new Error('404');
                }

                return fetchRootComponent(rootChunkID, rootModuleID).then(
                    Component => {
                        this.setRouteComponent(pathname, Component, { id });
                    }
                );
            })
            .catch(({ message }) => {
                const Component = message === '404' ? NotFound : InternalError;

                this.setRouteComponent(pathname, Component);
            });
    }

    setRouteComponent(pathname, Component, meta) {
        this.setState(() => ({ [pathname]: { Component, ...meta } }));
    }

    render() {
        const { location } = this.props;
        const { pathname } = location;
        const { [pathname]: routeInfo } = this.state;

        if (!routeInfo) {
            return <Loading />;
        }

        const { Component, ...routeProps } = routeInfo;

        return <Component {...routeProps} />;
    }
}
