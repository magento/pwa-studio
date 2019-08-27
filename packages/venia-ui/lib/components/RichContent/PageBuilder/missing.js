import React from 'react';
import defaultClasses from './missing.css';
import { mergeClasses } from '../../../classify';

const Missing = ({ classes, contentType }) => {
    classes = mergeClasses(defaultClasses, classes);
    return (
        <div className={classes.missing}>
            <strong>Error:</strong> No component for{' '}
            <strong>{contentType}</strong> content type.
        </div>
    );
};

export default Missing;
