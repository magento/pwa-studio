import React from 'react';
import { shape, string, bool } from 'prop-types';
import { useStyle } from '../../classify';
import defaultClasses from './pageLoadingIndicator.css';
import usePageLoadingIndicator from '@magento/peregrine/lib/talons/PageLoadingIndicator/usePageLoadingIndicator';

const PageLoadingIndicator = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { absolute } = props;
    const { isPageLoading } = usePageLoadingIndicator();

    if (!isPageLoading) {
        return null;
    }

    return (
        <div className={absolute ? classes.root_absolute : classes.root}>
            <div className={classes.indicator} />
            <div className={classes.indicator_secondary} />
        </div>
    );
};

PageLoadingIndicator.defaultProps = {
    classes: {},
    absolute: false
};

PageLoadingIndicator.propTypes = {
    classes: shape({
        root: string
    }),
    absolute: bool
};

export default PageLoadingIndicator;
