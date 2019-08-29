import React from 'react';
import defaultClasses from './buttonItem.css';
import { arrayOf, oneOf, string, bool } from 'prop-types';

const ButtonItem = ({
    buttonType,
    link,
    openInNewTab,
    text,
    display, // TODO - remove and calculate in component based on parent component's (button's) appearance
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
}) => {
    const dynamicOuterStyles = { // TODO - this is dictated by inline/stacked appearance of parent buttons component
        display
    };

    const dynamicInnerStyles = {
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

    const cssButtonTypeSuffix = buttonType.charAt(0).toUpperCase() + buttonType.substring(1);

    if (typeof link === 'string') {
        return (
            <div className={cssClasses.join(' ')} style={dynamicOuterStyles}>
                <a className={[defaultClasses.button, defaultClasses['button' + cssButtonTypeSuffix]].join(' ')} href={link} {...openInNewTab ? {target: '_blank'} : ''} style={dynamicInnerStyles}>
                    <span>{text}</span>
                </a>
            </div>
        )
    } else {
        return (
            <div className={cssClasses.join(' ')} style={dynamicOuterStyles}>
                <div className={[defaultClasses.button, defaultClasses['button' + cssButtonTypeSuffix], defaultClasses.emptyLink].join(' ')} style={dynamicInnerStyles}>
                    <span>{text}</span>
                </div>
            </div>
        )
    }
};

ButtonItem.propTypes = {
    buttonType: oneOf(['primary', 'secondary', 'link']),
    link: string,
    openInNewTab: bool,
    text: string,
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

export default ButtonItem;
