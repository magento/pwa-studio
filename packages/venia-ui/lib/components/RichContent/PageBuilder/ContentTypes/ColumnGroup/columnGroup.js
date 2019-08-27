import React from 'react';
import defaultClasses from './columnGroup.css';
import { mergeClasses } from '../../../../../classify';

const ColumnGroup = ({ classes, display, children }) => {
    classes = mergeClasses(defaultClasses, classes);
    const dynamicStyles = {
        display
    };

    return (
        <div
            style={dynamicStyles}
            className={classes.pagebuilderColumnGroup}
        >
            {children}
        </div>
    );
};

export default ColumnGroup;
