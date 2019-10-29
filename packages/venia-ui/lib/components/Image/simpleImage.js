import React from 'react';
import { string, func } from 'prop-types';

/**
 * Renders an img element directly using the supplied src.
 *
 * @param {String}  props.alt - The alt attribute for the img element.
 * @param {String}  props.className - The class name to apply to the img element.
 * @param {Func}    props.handleError - The function to call if the image fails to load.
 * @param {Func}    props.handleLoad - The function to call if the image successfully loads.
 * @param {String}  props.src - The src attribute for the img element.
 */
const SimpleImage = props => {
    const { alt, className, handleError, handleLoad, src, ...rest } = props;

    return (
        <img
            alt={alt}
            className={className}
            loading="lazy"
            onError={handleError}
            onLoad={handleLoad}
            src={src}
            {...rest}
        />
    );
};

SimpleImage.propTypes = {
    alt: string.isRequired,
    className: string,
    handleError: func,
    handleLoad: func,
    src: string.isRequired
};

export default SimpleImage;
