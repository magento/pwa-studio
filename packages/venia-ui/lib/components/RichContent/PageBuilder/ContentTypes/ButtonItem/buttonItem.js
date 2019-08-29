import React from 'react';
import defaultClasses from './buttonItem.css';
import { arrayOf, oneOf, string, bool } from 'prop-types';
import { Link } from '@magento/venia-drivers';
import resolveLinkProps from '../../../resolveLinkProps';

const ButtonItem = ({
    buttonType,
    link,
    linkType,
    openInNewTab,
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
}) => {
    const dynamicInnerStyles = {
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

    const cssButtonTypeSuffix = buttonType.charAt(0).toUpperCase() + buttonType.substring(1);

    if (typeof link === 'string') {
        const linkProps = resolveLinkProps(link, linkType);
        const LinkComponent = linkProps.to ? Link : 'a';

        return (
            <div className={cssClasses.join(' ')}>
                <LinkComponent
                    {...linkProps}
                    className={[defaultClasses.button, defaultClasses['button' + cssButtonTypeSuffix]].join(' ')}
                    {...openInNewTab ? {target: '_blank'} : ''}
                    style={dynamicInnerStyles}
                >
                    <span>{text}</span>
                </LinkComponent>
            </div>
        );
    } else {
        return (
            <div className={cssClasses.join(' ')}>
                <div className={[defaultClasses.button, defaultClasses['button' + cssButtonTypeSuffix], defaultClasses.emptyLink].join(' ')} style={dynamicInnerStyles}>
                    <span>{text}</span>
                </div>
            </div>
        );
    }
};

ButtonItem.propTypes = {
    buttonType: oneOf(['primary', 'secondary', 'link']),
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
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

export default ButtonItem;
