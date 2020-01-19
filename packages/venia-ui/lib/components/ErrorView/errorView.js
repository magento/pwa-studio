import React from 'react';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import { string } from 'prop-types';

export const ERROR_TYPES = {
    LOADING: 'loading',
    NOT_FOUND: 'notFound'
};

export const errorMap = new Map()
    .set('default', 'Something went wrong. Please try again.')
    .set('loading', fullPageLoadingIndicator)
    .set('notFound', 'That page could not be found. Please try again.');

const ErrorView = props => {
    const { type } = props;
    const key = type || 'default';

    return <h1>{errorMap.get(key)}</h1>;
};

ErrorView.propTypes = {
    type: string
};

export default ErrorView;
