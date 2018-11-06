import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';

import fetchRootComponent from './fetchRootComponent';
import resolveUnknownRoute from './resolveUnknownRoute';

const InternalError = Symbol('InternalError');
const NotFound = Symbol('NotFound');
const mountedInstances = new WeakSet();

export default class MagentoRouteHandler extends Component {
    static propTypes = {
        __tmp_webpack_public_path__: string.isRequired,
        apiBase: string.isRequired,
        children: func,
        location: shape({
            pathname: string.isRequired
        }).isRequired
    };

    state = {
        componentMap: new Map(),
        errorState: {
            hasError: false,
            internalError: false,
            notFound: false
        }
    };

    componentDidMount() {
        mountedInstances.add(this);
        this.getRouteComponent();
    }

    componentDidUpdate() {
        const { props, state } = this;
        const { pathname } = props.location;
        const isKnown = state.componentMap.has(pathname);

        // id of -1 is currently what defines a `NOTFOUND` component
        const isNotFoundComponent = isKnown
            ? state.componentMap.get(pathname).id === -1
            : false;

        const shouldReloadRoute = (isNotFoundComponent && navigator.onLine);

        if (!isKnown || shouldReloadRoute) {
            this.getRouteComponent();
        }
    }

    componentWillUnmount() {
        mountedInstances.delete(this);
    }

    async getRouteComponent() {
        const { __tmp_webpack_public_path__, apiBase, location } = this.props;
        const { pathname } = location;

        try {
            // try to resolve the route
            // if this throws, we essentially have a 500 Internal Error
            const resolvedRoute = await resolveUnknownRoute({
                __tmp_webpack_public_path__,
                apiBase,
                route: pathname
            });

            const { id, matched, rootChunkID, rootModuleID } = resolvedRoute;

            // if resolution and destructuring succeed but return no match
            // then we have a straightforward 404 Not Found
            if (!matched) {
                throw new Error('404');
            }

            // at this point we should have a matching RootComponent
            // if this throws, we essentially have a 500 Internal Error
            const RootComponent = await fetchRootComponent(
                rootChunkID,
                rootModuleID
            );

            // associate the matching RootComponent with this location
            this.setRouteComponent(pathname, RootComponent, { id });
        } catch ({ message }) {
            const symbol = message === '404' ? NotFound : InternalError;

            // we don't have a matching RootComponent, but we've checked for one
            // so associate the appropriate error case with this location
            this.setRouteComponent(pathname, symbol);
        }
    }

    setRouteComponent(pathname, RootComponent, meta) {
        if (!mountedInstances.has(this)) {
            // avoid setState if component is not mounted for any reason
            return;
        }

        this.setState(({ componentMap }) => ({
            componentMap: new Map(componentMap).set(pathname, {
                RootComponent,
                ...meta
            }),
            errorState: {
                hasError: typeof RootComponent === 'symbol',
                internalError: RootComponent === InternalError,
                notFound: RootComponent === NotFound
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
        const { RootComponent, ...routeProps } = componentMap.get(pathname);

        return <RootComponent {...routeProps} />;
    }
}
