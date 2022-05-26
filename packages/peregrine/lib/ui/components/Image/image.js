import React from 'react';
import PropTypes, {
    bool,
    func,
    instanceOf,
    number,
    oneOfType,
    shape,
    string
} from 'prop-types';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';
import { DEFAULT_WIDTH_TO_HEIGHT_RATIO } from '@magento/peregrine/lib/util/imageUtils';

import PlaceholderImage from './placeholderImage';
import ResourceImage from './resourceImage';
import SimpleImage from './simpleImage';
import { useStyle } from '../../classify';

import defaultClasses from './image.module.css';
/**
 * The Image component renders a placeholder until the image is loaded.
 *
 * @param {object}   props.classes any classes to apply to this component
 * @param {bool}     props.displayPlaceholder whether or not to display a placeholder while the image loads or if it errors on load.
 * @param {number}   props.height the intrinsic height of the image & the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {function} props.onError callback for error loading image
 * @param {function} props.onLoad callback for when image loads successfully
 * @param {string}   props.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {number}   props.ratio is the image width to height ratio. Defaults to `DEFAULT_WIDTH_TO_HEIGHT_RATIO` from `util/images.js`.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 */
const Image = props => {
    const {
        alt,
        classes: propsClasses,
        displayPlaceholder,
        height,
        onError,
        onLoad,
        placeholder,
        resource,
        src,
        type,
        width,
        widths,
        ratio,
        ...rest
    } = props;

    const talonProps = useImage({
        onError,
        onLoad,
        width,
        widths,
        height,
        ratio
    });

    const {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        resourceWidth: talonResourceWidth,
        resourceHeight: talonResourceHeight
    } = talonProps;

    const classes = useStyle(defaultClasses, propsClasses);
    const containerClass = `${classes.root} ${classes.container}`;
    const isLoadedClass = isLoaded ? classes.loaded : classes.notLoaded;
    const imageClass = `${classes.image} ${isLoadedClass}`;

    // If we have a src, use it directly. If not, assume this is a resource image.
    const actualImage = src ? (
        <SimpleImage
            alt={alt}
            className={imageClass}
            handleError={handleError}
            handleLoad={handleImageLoad}
            height={talonResourceHeight}
            src={src}
            width={width}
            {...rest}
        />
    ) : (
        <ResourceImage
            alt={alt}
            className={imageClass}
            handleError={handleError}
            handleLoad={handleImageLoad}
            height={talonResourceHeight}
            resource={resource}
            type={type}
            width={talonResourceWidth}
            widths={widths}
            ratio={ratio}
            {...rest}
        />
    );

    return (
        <div className={containerClass}>
            <PlaceholderImage
                alt={alt}
                classes={classes}
                displayPlaceholder={displayPlaceholder}
                height={height}
                imageHasError={hasError}
                imageIsLoaded={isLoaded}
                src={placeholder}
                width={talonResourceWidth}
                {...rest}
            />
            {actualImage}
        </div>
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
    alt: string.isRequired,
    classes: shape({
        container: string,
        loaded: string,
        notLoaded: string,
        root: string
    }),
    displayPlaceholder: bool,
    height: oneOfType([number, string]),
    onError: func,
    onLoad: func,
    placeholder: string,
    resource: conditionallyRequiredString,
    src: conditionallyRequiredString,
    type: string,
    width: oneOfType([number, string]),
    widths: instanceOf(Map),
    ratio: number
};

Image.defaultProps = {
    displayPlaceholder: true,
    ratio: DEFAULT_WIDTH_TO_HEIGHT_RATIO
};

export default Image;
