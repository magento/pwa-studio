import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './image.css';

/**
 * The Image component renders a placeholder until the image is loaded.
 * @param {string} prop.alt the alt text for the image
 * @param {string} props.classes any classes to apply to this component
 * @param {string} prop.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string} props.src the source of the image
 */
const Image = props => {
    const { alt, placeholder, src } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState();

    const handleImageLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    const handleError = useCallback(() => {
        setError(true);
    }, []);

    // On mount, reset loaded to false.
    useEffect(() => {
        setIsLoaded(false);
    }, [src]);

    // Render a placeholder until the image is loaded.
    const placeholderImage = placeholder && !isLoaded && (
        <img className={classes.root} src={placeholder} alt={alt} />
    );

    const imageClass =
        classes.root + ' ' + (isLoaded ? classes.loaded : classes.notLoaded);

    const actualImage = !error && (
        <img
            alt={alt}
            className={imageClass}
            onError={handleError}
            onLoad={handleImageLoad}
            src={src}
        />
    );

    return (
        <Fragment>
            {actualImage}
            {placeholderImage}
        </Fragment>
    );
};

Image.propTypes = {
    className: string,
    classes: shape({
        loaded: string,
        notLoaded: string,
        root: string
    }),
    alt: string,
    src: string,
    placeholder: string
};

export default Image;
