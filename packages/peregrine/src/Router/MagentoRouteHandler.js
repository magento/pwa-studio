import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import fetchRootComponent from './fetchRootComponent';
import resolveUnknownRoute from './resolveUnknownRoute';

const InternalError = Symbol('InternalError');
const NotFound = Symbol('NotFound');

export default class MagentoRouteHandler extends Component {
    static propTypes = {
        apiBase: string.isRequired,
        __tmp_webpack_public_path__: string.isRequired,
        location: shape({
            pathname: string.isRequired
        }).isRequired
    };

    state = {
        componentMap: new Map(),
        errorState: {}
    };

    componentDidMount() {
        this.getRouteComponent(this.props.location.pathname);
    }

    componentDidUpdate() {
        const { props, state } = this;
        const { pathname } = props.location;
        const isKnown = state.componentMap.has(pathname);

        if (!isKnown) {
            this.getRouteComponent(pathname);
        }
    }

    async getRouteComponent(pathname) {
        const { apiBase, __tmp_webpack_public_path__ } = this.props;

        try {
            // try to resolve the route
            // if this throws, we essentially have a 500 Internal Error
            const resolvedRoute = await resolveUnknownRoute({
                route: pathname,
                apiBase,
                __tmp_webpack_public_path__
            });

            const { id, matched, rootChunkID, rootModuleID } = resolvedRoute;

            // if resolution and destructuring succeed but return no match
            // then we have a straightforward 404 Not Found
            if (!matched) {
                throw new Error('404');
            }

            // at this point we should have a matching RootComponent
            // if this throws, we essentially have a 500 Internal Error
            const Component = await fetchRootComponent(
                rootChunkID,
                rootModuleID
            );

            // associate the matching RootComponent with this location
            this.setRouteComponent(pathname, Component, { id });
        } catch ({ message }) {
            const symbol = message === '404' ? NotFound : InternalError;

            // we don't have a matching RootComponent, but we've checked for one
            // so associate the appropriate error case with this location
            this.setRouteComponent(pathname, symbol);
        }
    }

    setRouteComponent(pathname, Component, meta) {
        this.setState(({ componentMap }) => ({
            componentMap: new Map(componentMap).set(pathname, {
                Component,
                ...meta
            }),
            errorState: {
                hasError: typeof Component === 'symbol',
                internalError: Component === InternalError,
                notFound: Component === NotFound
            }
        }));
    }

    renderChildren(loading) {
        const { props, state } = this;
        const { children } = props;
        const { errorState } = state;

        return typeof children === 'function'
            ? children({ ...errorState, loading })
            : null;
    }

    render() {
        const { props, state } = this;
        const { pathname } = props.location;
        const { componentMap, errorState } = state;

        // if we have no record of this pathname, we're still loading
        // and we have no RootComponent, so render children
        if (!componentMap.has(pathname)) {
            return this.renderChildren(true);
        }

        // if we're in an error state, we're not loading anymore
        // but we have no RootComponent, so render children
        if (errorState.hasError) {
            return this.renderChildren(false);
        }

        // otherwise we do have a RootComponent, so render it
        const { Component, ...routeProps } = componentMap.get(pathname);

        return <Component {...routeProps} />;
    }
}
