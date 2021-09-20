import React from 'react';
import { string } from 'prop-types';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import TYPES from './types';

const RootShimmer = props => {
    const { type } = props;

    if (!type || typeof TYPES[type] === 'undefined') {
        return fullPageLoadingIndicator;
    }

    const Component = TYPES[type];

    return <Component />;
};

RootShimmer.defaultProps = {
    type: null
};

RootShimmer.propTypes = {
    type: string
};

export default RootShimmer;
