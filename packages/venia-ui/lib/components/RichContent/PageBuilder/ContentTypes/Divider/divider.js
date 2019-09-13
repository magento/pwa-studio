import React from 'react';
import defaultClasses from './divider.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

const Divider = ({
    classes,
    width,
    color,
    thickness,
    textAlign,
    border,
    borderColor,
    borderWidth,
    borderRadius,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    cssClasses
}) => {
    classes = mergeClasses(defaultClasses, classes);
    cssClasses = cssClasses ? cssClasses : [];
    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };
    const hrStyles = {
        width,
        borderColor: color,
        borderWidth: thickness
    };
    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            <hr style={hrStyles} className={classes.hr} />
        </div>
    );
};

Divider.propTypes = {
    classes: shape({
        hr: string
    }),
    width: string,
    color: string,
    thickness: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

export default Divider;
