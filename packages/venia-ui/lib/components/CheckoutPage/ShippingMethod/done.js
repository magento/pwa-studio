import React from 'react';

import { mergeClasses } from '../../../classify';
import defaultClasses from './done.css';

const Done = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            <span>Done!</span>
        </>
    );
};

export default Done;
