import React, { useEffect }from 'react';
import defaultClasses from './buttons.css';
import { oneOf, arrayOf, string, bool } from 'prop-types';

const Buttons = ({
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
}) => {
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

    switch (textAlign) {
        case 'left':
        default:
            dynamicStyles.justifyContent = 'flex-start';
            break;
        case 'center':
            dynamicStyles.justifyContent = 'center';
            break;
        case 'right':
            dynamicStyles.justifyContent = 'flex-end';
            break;
    }

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
