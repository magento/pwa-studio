import React, { Fragment } from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer/shimmer.js';
import { useStyle } from '../../classify';

import defaultClasses from './cms.module.css';

const CMSPageShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Fragment>
            <div className={classes.root} aria-live="polite" aria-busy="true">
                <Shimmer width="100%" height="880px" key="banner" />
            </div>
        </Fragment>
    );
};

export default CMSPageShimmer;
