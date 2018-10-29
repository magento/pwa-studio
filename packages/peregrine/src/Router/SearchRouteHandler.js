import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import resolveSearchRoute from './resolveSearchRoute';
import fetchRootComponent from './fetchRootComponent';

export default class SearchRouteHandler extends Component {
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

    // Consider if this work needs to be repeated here. Can I just load searchComponent?

    getRouteComponent(pathname) {
        const { apiBase, __tmp_webpack_public_path__ } = this.props;

        resolveSearchRoute({
            route: pathname,
            apiBase,
            __tmp_webpack_public_path__
        })
            .then(({ rootChunkID, rootModuleID }) => {
                return fetchRootComponent(rootChunkID, rootModuleID).then(
                    Component => {
                        this.setState({
                            [pathname]: {
                                Component
                            }
                        });
                    }
                );
            })
            .catch(err => {
                console.log('Search Route resolve failed!\n', err);
            });
    }

    render() {
        const { location } = this.props;
        const routeInfo = this.state[location.pathname];

        if (!routeInfo) {
            return <div>Loading</div>;
        }

        const { Component, ...routeProps } = routeInfo;

        return <Component {...routeProps} />;
    }
}
