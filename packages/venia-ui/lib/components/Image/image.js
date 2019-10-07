import React, { Fragment, useMemo } from 'react';
import { func, shape, string } from 'prop-types';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';

import { generateSrcset } from '../../util/images';
import { mergeClasses } from '../../classify';
import defaultClasses from './image.css';

/**
 * The Image component renders a placeholder until the image is loaded.
 * @param {string} prop.alt the alt text for the image
 * @param {string} props.classes any classes to apply to this component
 * @param {string} prop.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string} props.src the source of the image
 * @param {string} props.fileSrc the raw source of the image without width and height added
 */
const Image = props => {
    const {
        alt,
        classes: propsClasses,
        onError,
        onLoad,
        placeholder,
        src,
        fileSrc,
        ...rest
    } = props;

    const talonProps = useImage({
        onError,
        onLoad,
        placeholder
    });

    const {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        shouldRenderPlaceholder
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propsClasses);

    // Render a placeholder until the image is loaded.
    const placeholderImage = shouldRenderPlaceholder ? (
        <img className={classes.root} src={placeholder} alt={alt} {...rest} />
    ) : null;

    const imageClass =
        classes.root + ' ' + (isLoaded ? classes.loaded : classes.notLoaded);

    const imageSrcset = useMemo(
        () => generateSrcset(fileSrc, 'image-product'),
        [fileSrc]
    );

    const actualImage = !hasError && (
        <img
            {...rest}
            alt={alt}
            className={imageClass}
            onError={handleError}
            onLoad={handleImageLoad}
            src={src}
            srcSet={imageSrcset}
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
    alt: string,
    classes: shape({
        loaded: string,
        notLoaded: string,
        root: string
    }),
    onError: func,
    onLoad: func,
    placeholder: string,
    src: string,
    fileSrc: string
};

export default Image;
