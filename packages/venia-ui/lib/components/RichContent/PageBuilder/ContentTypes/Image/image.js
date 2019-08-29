import React from 'react';
import { arrayOf, bool, oneOf, string } from 'prop-types';
import { Link } from '@magento/venia-drivers';
import resolveLinkProps from '../../../resolveLinkProps';

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

    const PictureFragment = (
        <>
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
        </>
    );

    if (typeof link === 'string') {
        const linkProps = resolveLinkProps(link, linkType);
        const LinkComponent = linkProps.to ? Link : 'a';

        return (
            <figure style={figureStyles} className={cssClasses.join(' ')}>
                <LinkComponent
                    {...linkProps}
                    {...openInNewTab ? {target: '_blank'} : ''}
                >
                    {PictureFragment}
                </LinkComponent>
            </figure>
        );
    } else {
        return (
            <figure style={figureStyles} className={cssClasses.join(' ')}>
                {PictureFragment}
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
