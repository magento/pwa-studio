import React, { useMemo } from 'react';

import { fullPageLoadingIndicator } from '../LoadingIndicator';

const messages = new Map()
    .set('loading', fullPageLoadingIndicator)
    .set('notFound', 'That page could not be found. Please try again.')
    .set('internalError', 'Something went wrong. Please try again.')
    .set(
        'outOfStock',
        'This Product is currently out of stock. Please try again later.'
    );

const ErrorView = props => {
    const { loading, notFound, outOfStock } = props;

    const message = useMemo(() => {
        return loading
            ? messages.get('loading')
            : notFound
            ? messages.get('notFound')
            : outOfStock
            ? messages.get('outOfStock')
            : messages.get('internalError');
    }, [loading, notFound, outOfStock]);

    return <h1>{message}</h1>;
};

export default ErrorView;
