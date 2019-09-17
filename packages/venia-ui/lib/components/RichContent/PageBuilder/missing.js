import React from 'react';
import defaultClasses from './missing.css';
import { mergeClasses } from '../../../classify';
import { shape, string } from 'prop-types';

const Missing = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.missing}>
            <strong>{'Error:'}</strong>
            {' No component for '}
            <strong>{props.contentType}</strong>
            {' content type.'}
        </div>
    );
};

Missing.propTypes = {
    classes: shape({
        missing: string
    }),
    contentType: string
};

export default Missing;
