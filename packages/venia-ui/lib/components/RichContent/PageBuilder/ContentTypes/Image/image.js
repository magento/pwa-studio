import React from 'react';
import { arrayOf, bool, oneOf, string } from 'prop-types';
import { Link } from '@magento/venia-drivers';

const Image = ({
    desktopImage,
    mobileImage,
    altText,
    title,
    link,
    linkType,
    openInNewTab,
    caption,
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
    const figureStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };
    const imageStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius
    };

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
                if (linkType !== 'default' && !/\.html$/.test(linkOpts['to'])) {
                    linkOpts['to'] += '.html';
                }
            }
        } catch (e) {
            isExternalUrl = true;
            linkOpts['href'] = link;
        }

        const LinkComponent = isExternalUrl ? 'a' : Link;

        return (
            <figure style={figureStyles} className={cssClasses.join(' ')}>
                <LinkComponent
                    {...linkOpts}
                    {...openInNewTab ? {target: '_blank'} : ''}
                >
                    <picture>
                        {mobileImage ? (
                            <source
                                media="(max-width: 768px)"
                                srcSet={mobileImage}
                            />
                        ) : (
                            ''
                        )}
                        <img
                            src={desktopImage}
                            title={title}
                            alt={altText}
                            style={imageStyles}
                            loading="lazy"
                        />
                    </picture>
                    {caption ? <figcaption>{caption}</figcaption> : ''}
                </LinkComponent>
            </figure>
        );
    } else {
        return (
            <figure style={figureStyles} className={cssClasses.join(' ')}>
                <picture>
                    {mobileImage ? (
                        <source
                            media="(max-width: 768px)"
                            srcSet={mobileImage}
                        />
                    ) : (
                        ''
                    )}
                    <img
                        src={desktopImage}
                        title={title}
                        alt={altText}
                        style={imageStyles}
                    />
                </picture>
                {caption ? <figcaption>{caption}</figcaption> : ''}
            </figure>
        );
    }
};

Image.propTypes = {
    desktopImage: string,
    mobileImage: string,
    altText: string,
    title: string,
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
    caption: string,
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

export default Image;
