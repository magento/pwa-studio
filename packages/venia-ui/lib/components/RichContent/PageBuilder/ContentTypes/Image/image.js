import React from 'react';
import { arrayOf, string } from 'prop-types';

// TODO: implement link functionality
const Image = ({
    desktopImage,
    mobileImage,
    altText,
    title,
    //link,
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
    cssClasses
}) => {
    cssClasses = cssClasses ? cssClasses : [];
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
    return (
        <>
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
        </>
    );
};

Image.propTypes = {
    desktopImage: string,
    mobileImage: string,
    altText: string,
    title: string,
    //link: string,
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
