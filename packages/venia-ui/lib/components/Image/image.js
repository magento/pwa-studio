import React from 'react';
import PropTypes, {
    bool,
    func,
    instanceOf,
    number,
    shape,
    string
} from 'prop-types';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';

import { mergeClasses } from '../../classify';
import defaultClasses from './image.css';
import PlaceholderImage from './placeholderImage';
import ResourceImage from './resourceImage';
import SimpleImage from './simpleImage';

/**
 * The Image component renders a placeholder until the image is loaded.
 *
 * @param {object}   props.classes any classes to apply to this component
 * @param {bool}     props.displayPlaceholder whether or not to display a placeholder while the image loads or if it errors on load.
 * @param {function} props.onError callback for error loading image
 * @param {function} props.onLoad callback for when image loads successfully
 * @param {string}   props.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {number}   props.resourceHeight the intrinsic height of the image & the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}      props.resourceSizeBreakpoints breakpoints related to resourceSizes. Supported keys are 'small' and 'medium'.
 * @param {Map}      props.resourceSizes image sizes used by the browser to select the image source. Supported keys are 'small', 'medium', and 'large'.
 * @param {number}   props.resourceWidth the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 */
const Image = props => {
    const {
        alt,
        classes: propsClasses,
        displayPlaceholder,
        onError,
        onLoad,
        placeholder,
        resource,
        resourceHeight,
        resourceSizeBreakpoints,
        resourceSizes,
        resourceWidth,
        src,
        type,
        ...rest
    } = props;

    const talonProps = useImage({
        onError,
        onLoad,
        resourceSizes,
        resourceWidth
    });

    const {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        resourceWidth: talonResourceWidth
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propsClasses);
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
            src={src}
            {...rest}
        />
    ) : (
        <ResourceImage
            alt={alt}
            className={imageClass}
            handleError={handleError}
            handleLoad={handleImageLoad}
            resource={resource}
            resourceHeight={resourceHeight}
            resourceSizeBreakpoints={resourceSizeBreakpoints}
            resourceSizes={resourceSizes}
            resourceWidth={talonResourceWidth}
            type={type}
            {...rest}
        />
    );

    return (
        <div className={containerClass}>
            <PlaceholderImage
                alt={alt}
                classes={classes}
                displayPlaceholder={displayPlaceholder}
                imageHasError={hasError}
                imageIsLoaded={isLoaded}
                resourceHeight={resourceHeight}
                resourceSizes={resourceSizes}
                resourceWidth={talonResourceWidth}
                src={placeholder}
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
    onError: func,
    onLoad: func,
    placeholder: string,
    resource: conditionallyRequiredString,
    resourceHeight: number,
    resourceSizeBreakpoints: instanceOf(Map),
    resourceSizes: instanceOf(Map),
    resourceWidth: number,
    src: conditionallyRequiredString,
    type: string
};

Image.defaultProps = {
    displayPlaceholder: true
};

export default Image;
