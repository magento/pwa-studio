import React from 'react';
import defaultClasses from './buttons.css';
import { arrayOf, string } from 'prop-types';

const Buttons = ({
    appearance,
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
    children,
    cssClasses = []
}) => {
    const dynamicStyles = {
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

    if (appearance === 'stacked') {
        dynamicStyles.flexDirection = 'column';
    }

    return (
        <div style={dynamicStyles} className={[defaultClasses.root, ...cssClasses].join(' ')}>
            {children}
        </div>
    );
};

Buttons.propTypes = {
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

export default Buttons;
