import React, { useEffect } from 'react';
import defaultClasses from './buttons.css';
import { oneOf, arrayOf, string, bool } from 'prop-types';

const Buttons = props => {
    const {
        appearance,
        isSameWidth,
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
        children,
        cssClasses = []
    } = props;

    useEffect(() => {
        if (!isSameWidth) {
            return;
        }

        // TODO - resize button children to maxWidth of widest button
    });

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

    const justifyMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end"
    };

    dynamicStyles.justifyContent = "flex-start";
    if (textAlign) {
        dynamicStyles.justifyContent = justifyMap[textAlign] || "flex-start";
    }

    if (appearance === 'stacked') {
        dynamicStyles.flexDirection = 'column';
    }

    return (
        <div
            style={dynamicStyles}
            className={[defaultClasses.root, ...cssClasses].join(' ')}
        >
            {children}
        </div>
    );
};

Buttons.propTypes = {
    appearance: oneOf(['inline', 'stacked']),
    isSameWidth: bool,
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
