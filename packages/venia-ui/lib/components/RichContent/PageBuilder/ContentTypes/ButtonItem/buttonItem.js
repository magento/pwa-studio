import React from 'react';
import defaultClasses from './buttonItem.css';
import { arrayOf, oneOf, string, bool } from 'prop-types';
import { Link } from '@magento/venia-drivers';
import resolveLinkProps from '../../resolveLinkProps';

const ButtonItem = props => {
    const {
        buttonType,
        link,
        linkType,
        openInNewTab = false,
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

    const cssButtonTypeSuffix =
        buttonType.charAt(0).toUpperCase() + buttonType.substring(1);

    let linkProps = {};
    let LinkComponent = 'div';
    if (typeof link === 'string') {
        linkProps = resolveLinkProps(link, linkType);
        LinkComponent = linkProps.to ? Link : 'a';
    }

    return (
        <div className={cssClasses.join(' ')}>
            <LinkComponent
                {...linkProps}
                className={defaultClasses['button' + cssButtonTypeSuffix]}
                {...(openInNewTab ? { target: '_blank' } : '')}
                style={dynamicInnerStyles}
            >
                <span>{text}</span>
            </LinkComponent>
        </div>
    );
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
