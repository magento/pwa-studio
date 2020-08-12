import React from 'react';
import ErrorView from '../ErrorView';
import {
    INTERNAL_ERROR,
    NOT_FOUND,
    useMagentoRoute
} from '@magento/peregrine/lib/talons/MagentoRoute';

import { fullPageLoadingIndicator } from '../LoadingIndicator';

const MESSAGES = new Map()
    .set(NOT_FOUND, 'That page could not be found. Please try again.')
    .set(INTERNAL_ERROR, 'Something went wrong. Please try again.');

const MagentoRoute = () => {
    const talonProps = useMagentoRoute();
    const { component: RootComponent, id, isLoading, routeError } = talonProps;

    if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (routeError === NOT_FOUND) {
        return (
            <ErrorView>
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
