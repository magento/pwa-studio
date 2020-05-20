import React from 'react';

import { mergeClasses } from '../../../../classify';

import defaultClasses from './freeSummary.css';

const FreeSummary = props => {
    const { classes: propClasses } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <div className={classes.root}>No payment required at this moment</div>
    );
};

export default FreeSummary;
