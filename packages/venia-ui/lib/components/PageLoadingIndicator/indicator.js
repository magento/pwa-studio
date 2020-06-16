import React from 'react';

import defaultClasses from './indicator.css';
import { mergeClasses } from '../../classify';
import { RotateCw as LoaderIcon } from 'react-feather';
import Icon from '../Icon';

const PageLoadingIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const iconClasses = { root: classes.indicator, icon: classes.icon };

    return (
        <div className={classes.root}>
            <Icon src={LoaderIcon} size={24} classes={iconClasses} />
        </div>
    );
};

export default PageLoadingIndicator;
