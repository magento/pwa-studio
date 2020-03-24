import React from 'react';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './done.css';

const Done = props => {
    const { showEditMode } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            <span>TBD: shipping methods read only view</span>
            <Button onClick={showEditMode}>Edit Mode</Button>
        </>
    );
};

export default Done;
