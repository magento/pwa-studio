import React from 'react';
import { string } from 'prop-types';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import * as Types from './types';

const RootShimmer = props => {
    const { type } = props;

    if (!type || typeof Types[type] === 'undefined') {
        return fullPageLoadingIndicator;
    }

    const Component = Types[type];

    return <Component />;
};

RootShimmer.defaultProps = {
    type: null
};

RootShimmer.propTypes = {
    type: string
};

export default RootShimmer;
