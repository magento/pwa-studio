import React, { useMemo } from 'react';
import PropTypes, {
    bool,
    func,
    number,
    oneOfType,
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
 * @param {number}   props.resourceHeight the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {object}   props.resourceSizeBreakpoints breakpoints related to resourceSizes.
 * @param {object}   props.resourceSizes image sizes used by the browser to select the image source.
 * @param {number}   props.resourceWidth the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 */
const Image = props => {
    const {
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
        resourceSizes
    });

    const {
        customCSSProperties,
        handleError,
        handleImageLoad,
        hasError,
        isLoaded
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propsClasses);
    const containerClass = `${classes.root} ${classes.container}`;
    const isLoadedClass = isLoaded ? classes.loaded : classes.notLoaded;
    const imageClass = `${classes.image} ${isLoadedClass}`;

    // If we have a src, use it directly. If not, assume this is a resource image.
    const actualImage = src ? (
        <SimpleImage
            className={imageClass}
            handleError={handleError}
            handleLoad={handleImageLoad}
            src={src}
            {...rest}
        />
    ) : (
        <ResourceImage
            className={imageClass}
            customCSSProperties={customCSSProperties}
            handleError={handleError}
            handleLoad={handleImageLoad}
            resource={resource}
            resourceHeight={resourceHeight}
            resourceSizeBreakpoints={resourceSizeBreakpoints}
            resourceSizes={resourceSizes}
            resourceWidth={resourceWidth}
            type={type}
            {...rest}
        />
    );

    return (
        <div className={containerClass}>
            <PlaceholderImage
                classes={classes}
                customCSSProperties={customCSSProperties}
                displayPlaceholder={displayPlaceholder}
                imageHasError={hasError}
                imageIsLoaded={isLoaded}
                resourceSizes={resourceSizes}
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
    resourceHeight: oneOfType([number, string]),
    resourceSizeBreakpoints: shape({
        small: string,
        medium: string
    }),
    resourceSizes: shape({
        small: string,
        medium: string,
        large: string
    }),
    resourceWidth: oneOfType([number, string]),
    src: conditionallyRequiredString,
    type: string
};

Image.defaultProps = {
    displayPlaceholder: true
};

export default Image;
