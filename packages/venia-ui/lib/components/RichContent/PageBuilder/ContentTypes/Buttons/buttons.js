import React, { useEffect } from 'react';
import defaultClasses from './buttons.css';
import { oneOf, arrayOf, string, bool, shape } from 'prop-types';
import { mergeClasses } from '../../../../../classify';

const Buttons = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

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

    const appearanceClassName = classes[`${appearance}`];
    const sameWidthClassName =
        classes[`${isSameWidth ? 'same_width' : undefined}`];

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
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
    };

    dynamicStyles.alignSelf = 'flex-start';
    if (textAlign) {
        dynamicStyles.alignSelf = justifyMap[textAlign] || 'flex-start';
        dynamicStyles.textAlign = textAlign;
    }

    return (
        <div
            style={dynamicStyles}
            className={[
                classes.root,
                appearanceClassName,
                sameWidthClassName,
                ...cssClasses
            ].join(' ')}
        >
            {children}
        </div>
    );
};

Buttons.propTypes = {
    appearance: oneOf(['inline', 'stacked']),
    classes: shape({
        root: string,
        stacked: string,
        same_width: string
    }),
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
