import React, { Fragment, useMemo } from 'react';
import PropTypes, {
    bool,
    func,
    number,
    oneOfType,
    shape,
    string
} from 'prop-types';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { resourceUrl } from '@magento/venia-drivers';

import { generateSrcset } from '../../util/images';
import { mergeClasses } from '../../classify';
import defaultClasses from './image.css';

/**
 * The Image component renders a placeholder until the image is loaded.
 *
 * @param {string}   props.alt the alt text for the image
 * @param {string}   props.classes any classes to apply to this component
 * @param {function} props.onError callback for error loading image
 * @param {function} props.onLoad callback for when image loads successfully
 * @param {string}   props.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {number}   props.resourceHeight the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {number}   props.resourceWidth the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.sizes the desired sizes attribute of the image
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {bool}     props.usePlaceholder whether or not to display a placeholder while the image loads or if it errors on load.
 */
const Image = props => {
    const {
        alt,
        classes: propsClasses,
        onError,
        onLoad,
        placeholder,
        resource,
        resourceHeight,
        resourceWidth,
        sizes,
        src,
        type,
        usePlaceholder,
        ...rest
    } = props;

    const talonProps = useImage({
        onError,
        onLoad
    });

    const {
        handleError,
        handleImageLoad,
        isLoaded,
        shouldRenderPlaceholder
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propsClasses);

    // A placeholder to use until the image is loaded.
    const placeholderImage =
        usePlaceholder && shouldRenderPlaceholder ? (
            <img alt={alt} loading="eager" src={placeholder} {...rest} />
        ) : null;

    /*
     * These don't live in the talon because they depend on @magento/venia-drivers.
     */
    const imageSrcset = useMemo(() => generateSrcset(resource, type), [
        resource,
        type
    ]);
    const source = useMemo(() => {
        // If we have a direct src, use it.
        // Otherwise, get a resourceUrl from the resource and use that.
        return src
            ? src
            : resourceUrl(resource, {
                  type,
                  height: resourceHeight,
                  width: resourceWidth
              });
    }, [resource, resourceHeight, resourceWidth, src, type]);

    const imageClass =
        classes.root + ' ' + (isLoaded ? classes.loaded : classes.notLoaded);
    const actualImage = (
        /*
         * Note: attributes that are allowed to be overridden
         * must appear before the spread of `rest`.
         */
        <img
            loading="lazy"
            {...rest}
            alt={alt}
            className={imageClass}
            onError={handleError}
            onLoad={handleImageLoad}
            sizes={sizes}
            src={source}
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

const conditionallyRequiredString = (props, propName, componentName) => {
    // This component needs one of src or resource to be provided.
    if (!props.src && !props.resource) {
        return new Error(
            `Missing both 'src' and 'resource' props in ${componentName}. ${componentName} needs at least one of these to be provided.`
        );
    }

    return PropTypes.checkPropTypes(
        {
            resource: string,
            src: string
        },
        props,
        propName,
        componentName
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
    resource: conditionallyRequiredString,
    resourceHeight: oneOfType([number, string]),
    resourceWidth: oneOfType([number, string]),
    sizes: string,
    src: conditionallyRequiredString,
    type: string,
    usePlaceholder: bool
};

Image.defaultProps = {
    placeholder: transparentPlaceholder,
    type: 'image-product',
    usePlaceholder: true
};

export default Image;
