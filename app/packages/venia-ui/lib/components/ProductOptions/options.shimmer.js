import React, { Fragment } from 'react';
import OptionShimmer from './option.shimmer';

const OPTION_COUNT = 2;

export default () => {
    return (
        <Fragment>
            {Array.from({ length: OPTION_COUNT })
                .fill(null)
                .map((item, index) => {
                    return <OptionShimmer key={`product-option-${index}`} />;
                })}
        </Fragment>
    );
};
