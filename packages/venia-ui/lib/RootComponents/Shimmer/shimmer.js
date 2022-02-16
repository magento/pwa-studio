import React from 'react';
import { string } from 'prop-types';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import TYPES from './types';

const RootShimmer = props => {
    const { type } = props;

    if (!type || typeof TYPES[type] === 'undefined') {
        // Investigate why it still shows on CMSPages
        // even when it was not called
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
