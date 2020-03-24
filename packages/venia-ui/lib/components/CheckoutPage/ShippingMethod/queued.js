import React from 'react';

import { mergeClasses } from '../../../classify';
import defaultClasses from './queued.css';

const Queued = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return <h2 className={classes.heading}>Shipping Method</h2>;
};

export default Queued;
