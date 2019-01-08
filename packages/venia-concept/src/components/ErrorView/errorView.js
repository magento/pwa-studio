import React, { Component } from 'react';

import { loadingIndicator } from 'src/components/LoadingIndicator';

const messages = new Map()
    .set('loading', loadingIndicator)
    .set('notFound', '404 Not Found')
    .set('internalError', '500 Internal Server Error');

class ErrorView extends Component {
    render() {
        const { loading, notFound } = this.props;
        const message = loading
            ? messages.get('loading')
            : notFound
            ? messages.get('notFound')
            : messages.get('internalError');

        return <h1>{message}</h1>;
    }
}

export default ErrorView;
