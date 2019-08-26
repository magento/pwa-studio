import React from 'react';
import defaultClasses from './columnGroup.css';
import classify from 'src/classify';

const ColumnGroup = ({ classes, appearance, display, children }) => {
    const dynamicStyles = {
        display
    };

    return (
        <div
            data-content-type="column-group"
            style={dynamicStyles}
            className={classes.pagebuilderColumnGroup}
        >
            {children}
        </div>
    );
};

export default classify(defaultClasses)(ColumnGroup);
