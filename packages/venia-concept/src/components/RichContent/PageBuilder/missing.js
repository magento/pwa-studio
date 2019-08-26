import React from 'react';
import defaultClasses from "./missing.css";
import classify from "src/classify";

const Missing = ({classes, contentType}) => {
    return (
        <div className={classes.missing}>
            <strong>Error:</strong> No component for <strong>{contentType}</strong> content type.
        </div>
    );
};

export default classify(defaultClasses)(Missing);
