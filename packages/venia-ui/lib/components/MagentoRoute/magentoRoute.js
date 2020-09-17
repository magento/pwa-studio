import React from 'react';
import { useIntl } from 'react-intl';
import ErrorView from '../ErrorView';
import {
    INTERNAL_ERROR,
    NOT_FOUND,
    useMagentoRoute
} from '@magento/peregrine/lib/talons/MagentoRoute';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import GET_CONFIG_DATA from '../../queries/getStoreConfigData.graphql';

const MESSAGES = new Map()
    .set(NOT_FOUND, 'That page could not be found. Please try again.')
    .set(INTERNAL_ERROR, 'Something went wrong. Please try again.');

const MagentoRoute = () => {
    const { formatMessage } = useIntl();
    const magentoRouteProps = { getStoreConfig: GET_CONFIG_DATA };
    // If we have a specific store view code configured pass it into the url resolver

    const talonProps = useMagentoRoute(magentoRouteProps);
    const {
        component: RootComponent,
        id,
        isLoading,
        isRedirect,
        routeError
    } = talonProps;

    if (isLoading || isRedirect) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (routeError === NOT_FOUND) {
        return (
            <ErrorView>
                <h1>
                    {formatMessage({
                        id: 'magentoRoute.routeError',
                        defaultMessage: MESSAGES.get(routeError)
                    })}
                </h1>
            </ErrorView>
        );
    }

    return (
        <ErrorView>
            <h1>
                {formatMessage({
                    id: 'magentoRoute.internalError',
                    defaultMessage: MESSAGES.get(INTERNAL_ERROR)
                })}
            </h1>
        </ErrorView>
    );
};

export default MagentoRoute;
