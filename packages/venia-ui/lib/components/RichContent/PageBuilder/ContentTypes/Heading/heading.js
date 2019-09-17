import React from 'react';
import defaultClasses from './heading.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

const Heading = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        headingType,
        text,
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
        cssClasses = []
    } = props;
    const rootClass = classes[`root_${headingType}`];
    const HeadingType = `${headingType}`;
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
    cssClasses.push(classes.heading);
    return (
        <HeadingType style={dynamicStyles} className={rootClass}>
            {text}
        </HeadingType>
    );
};

Heading.propTypes = {
    classes: shape({
        heading: string
    }),
    headingType: string,
    text: string,
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

export default Heading;
