import React from 'react';
import { useIntl } from 'react-intl';
import ErrorView from '../ErrorView';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import NotFound from '@magento/venia-ui/lib/RootComponents/NotFound/notFound';

const MESSAGES = new Map()
    .set('NOT_FOUND', 'That page could not be found. Please try again.')
    .set('INTERNAL_ERROR', 'Something went wrong. Please try again.');

const MagentoRoute = () => {
    const { formatMessage } = useIntl();
    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        id,
        isLoading,
        isNotFound,
        isRedirect
    } = talonProps;

    if (isLoading || isRedirect) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (isNotFound) {
        return (
            <NotFound
            // message={formatMessage({
            //     id: 'magentoRoute.routeError',
            //     defaultMessage: MESSAGES.get('NOT_FOUND')
            // })}
            />
        );
    }

    return (
        <ErrorView>
            <h1>
                {formatMessage({
                    id: 'magentoRoute.internalError',
                    defaultMessage: MESSAGES.get('INTERNAL_ERROR')
                })}
            </h1>
        </ErrorView>
    );
};

export default MagentoRoute;
