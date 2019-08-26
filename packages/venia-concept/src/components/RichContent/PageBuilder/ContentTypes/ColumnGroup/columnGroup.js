import React from 'react';
import defaultClasses from './columnGroup.css';
import classify from "../../../../../classify";

const ColumnGroup = ({ classes, display, children }) => {
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
