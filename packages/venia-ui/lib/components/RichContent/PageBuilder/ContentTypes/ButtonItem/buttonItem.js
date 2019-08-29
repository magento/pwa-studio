import React from 'react';
import defaultClasses from './buttonItem.css';
import { arrayOf, oneOf, string, bool } from 'prop-types';
import { Link } from '@magento/venia-drivers';

const ButtonItem = ({
    buttonType,
    link,
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
        let isExternalUrl;
        const linkOpts = {};

        try {
            const baseUrl = document.querySelector('link[rel="preconnect"]').getAttribute('href'); // TODO - some better way to get this?
            const baseUrlObj = new URL(baseUrl);
            const urlObj = new URL(link);
            isExternalUrl = baseUrlObj.host !== urlObj.host;

            if (isExternalUrl) {
                linkOpts['href'] = link;
            } else {
                linkOpts['to'] = urlObj.pathname;
            }
        } catch (e) {
            isExternalUrl = true;
            linkOpts['href'] = link;
        }

        const LinkComponent = isExternalUrl ? 'a' : Link;

        return (
            <div className={cssClasses.join(' ')}>
                <LinkComponent
                    {...linkOpts}
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
