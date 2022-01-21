import React from 'react';
import { func, number, oneOfType, string } from 'prop-types';

/**
 * Renders an img element directly using the supplied src.
 *
 * @param {String}  props.alt - The alt attribute for the img element.
 * @param {String}  props.className - The class name to apply to the img element.
 * @param {Func}    props.handleError - The function to call if the image fails to load.
 * @param {Func}    props.handleLoad - The function to call if the image successfully loads.
 * @param {Number}  props.height - The height of the img element.
 * @param {String}  props.src - The src attribute for the img element.
 * @param {Number}  props.width - The width of the img element.
 */
const SimpleImage = props => {
    const {
        alt,
        className,
        handleError,
        handleLoad,
        height,
        src,
        width,
        ...rest
    } = props;
    const dimensionAttributes = {};
    if (typeof height !== 'undefined') {
        dimensionAttributes['--height'] = height + 'px';
    }
    if (typeof width !== 'undefined') {
        dimensionAttributes['--width'] = width + 'px';
    }
    // Note: Attributes that are allowed to be overridden must appear before the spread of `rest`.
    return (
        <img
            loading="lazy"
            style={dimensionAttributes}
            {...rest}
            alt={alt}
            className={className}
            height={height}
            onError={handleError}
            onLoad={handleLoad}
            src={src}
            width={width}
        />
    );
};

SimpleImage.propTypes = {
    alt: string.isRequired,
    className: string,
    handleError: func,
    handleLoad: func,
    height: oneOfType([number, string]),
    src: string.isRequired,
    width: oneOfType([number, string])
};

export default SimpleImage;
