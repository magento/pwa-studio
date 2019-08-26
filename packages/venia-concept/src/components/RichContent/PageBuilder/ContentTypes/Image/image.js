import React from 'react';
import defaultClasses from "./image.css";
import classify from "src/classify";

const Image = ({classes, desktopImage, mobileImage, altText, title, link, caption, textAlign, border, borderColor, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, cssClasses}) => {
    const figureStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    };
    const imageStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius,
    };
    return (
        <>
            <figure style={figureStyles} className={cssClasses}>
                <picture>
                    {mobileImage ? <source media="(max-width: 768px)" srcSet={mobileImage} /> : ''}
                    <img src={desktopImage} title={title} alt={altText} style={imageStyles} />
                </picture>
                {caption ? <figcaption>{caption}</figcaption> : ''}
            </figure>
        </>
    );
};

export default classify(defaultClasses)(Image);
