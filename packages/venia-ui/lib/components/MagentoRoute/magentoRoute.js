import React from 'react';
import { useIntl } from 'react-intl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import RootShimmerComponent from '../../RootComponents/Shimmer';

const MESSAGES = new Map()
    .set(
        'NOT_FOUND',
        "Looks like the page you were hoping to find doesn't exist. Sorry about that."
    )
    .set('INTERNAL_ERROR', 'Something went wrong. Sorry about that.');

const MagentoRoute = () => {
    const { formatMessage } = useIntl();
    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        id,
        isLoading,
        isNotFound,
        isRedirect,
        shimmer
    } = talonProps;

    if (isLoading || isRedirect) {
        // Show root component shimmer
        if (shimmer) {
            return <RootShimmerComponent type={shimmer} />;
        }

        // Show previous component
        if (RootComponent) {
            return <RootComponent id={id} />;
        }

        return <RootShimmerComponent />;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (isNotFound) {
        return (
            <ErrorView
                message={formatMessage({
                    id: 'magentoRoute.routeError',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }

    return (
        <ErrorView
            message={formatMessage({
                id: 'magentoRoute.internalError',
                defaultMessage: MESSAGES.get('INTERNAL_ERROR')
            })}
        />
    );
};

export default MagentoRoute;
