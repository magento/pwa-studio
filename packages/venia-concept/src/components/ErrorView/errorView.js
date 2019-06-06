import React, { Component } from 'react';

import { loadingIndicator } from 'src/components/LoadingIndicator';

const messages = new Map()
    .set('loading', loadingIndicator)
    .set('notFound', 'That page could not be found. Please try again.')
    .set('internalError', 'Something went wrong. Please try again.')
    .set(
        'outOfStock',
        'This Product is currently out of stock. Please try again later.'
    );

class ErrorView extends Component {
    render() {
        const { loading, notFound, outOfStock } = this.props;
        const message = loading
            ? messages.get('loading')
            : notFound
            ? messages.get('notFound')
            : outOfStock
            ? messages.get('outOfStock')
            : messages.get('internalError');

        return <h1>{message}</h1>;
    }
}

export default ErrorView;
