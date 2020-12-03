import React from 'react';
import ErrorView from '../ErrorView';
import {
    INTERNAL_ERROR,
    NOT_FOUND,
    useMagentoRoute
} from '@magento/peregrine/lib/talons/MagentoRoute';
import { Meta } from '@magento/venia-ui/lib/components/Head';

import { fullPageLoadingIndicator } from '../LoadingIndicator';

const MESSAGES = new Map()
    .set(NOT_FOUND, 'That page could not be found. Please try again.')
    .set(INTERNAL_ERROR, 'Something went wrong. Please try again.');

const MagentoRoute = () => {
    const talonProps = useMagentoRoute();
    const { component: RootComponent, id, isLoading, routeError } = talonProps;

    const metaElements =
        routeError === NOT_FOUND ? (
            <Meta name="prerender-status-code" content="404" />
        ) : null;

    if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (routeError === NOT_FOUND) {
        return (
            <ErrorView>
                {metaElements}
                <h1>{MESSAGES.get(routeError)}</h1>
            </ErrorView>
        );
    }

    return (
        <ErrorView>
            <h1>{MESSAGES.get(INTERNAL_ERROR)}</h1>
        </ErrorView>
    );
};

export default MagentoRoute;
