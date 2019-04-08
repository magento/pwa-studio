import React, { Component } from 'react';

import { loadingIndicator } from 'src/components/LoadingIndicator';

const messages = new Map()
    .set('loading', loadingIndicator)
    .set('notFound', 'That page could not be found. Please try again.')
    .set('internalError', 'Something went wrong. Please try again.');

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
