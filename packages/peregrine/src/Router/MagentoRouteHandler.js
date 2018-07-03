import { createElement, Component } from 'react';
import { string, shape } from 'prop-types';
import resolveUnknownRoute from './resolveUnknownRoute';
import fetchRootComponent from './fetchRootComponent';

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

    componentWillReceiveProps(nextProps) {
        const { location } = this.props;
        const changed = nextProps.location.pathname !== location.pathname;
        const seen = !!this.state[nextProps.location.pathname];

        if (changed && !seen) {
            this.getRouteComponent(nextProps.location.pathname);
        }
    }

    getRouteComponent(pathname) {
        const { apiBase, __tmp_webpack_public_path__ } = this.props;

        resolveUnknownRoute({
            route: pathname,
            apiBase,
            __tmp_webpack_public_path__
        })
            .then(({ rootChunkID, rootModuleID, matched, id }) => {
                if (!matched) {
                    // TODO: User-defined 404 page
                    // when the API work is done to support it
                    throw new Error('404');
                }
                return fetchRootComponent(rootChunkID, rootModuleID).then(
                    Component => {
                        this.setState({
                            [pathname]: {
                                Component,
                                id
                            }
                        });
                    }
                );
            })
            .catch(err => {
                console.log('Routing resolve failed\n', err);
            });
    }

    render() {
        const { location } = this.props;
        const routeInfo = this.state[location.pathname];

        if (!routeInfo) {
            // TODO (future iteration): User-defined loading content
            return <div>Loading</div>;
        }

        const { Component, ...routeProps } = routeInfo;

        return <Component {...routeProps} />;
    }
}
