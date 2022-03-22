import React, { useMemo, useRef, useEffect } from 'react';
import { arrayOf, shape, string, number } from 'prop-types';
import defaultClasses from './image.shimmer.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

/**
 * Page Builder Image Shimmer component.
 *
 * @typedef ImageShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element|null} A React component that displays an Image Shimmer.
 */
const ImageShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        desktopImage,
        mobileImage,
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
        cssClasses = []
    } = props;

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

    const figureRef = useRef();

    const dimensions = useMemo(() => {
        const value = {
            height: 0,
            width: 0
        };
        if (
            window.matchMedia('(max-width: 48rem)').matches &&
            mobileImage &&
            mobileImage.dimensions
        ) {
            value.width = mobileImage.dimensions.width;
            value.height = mobileImage.dimensions.height;
        } else if (desktopImage && desktopImage.dimensions) {
            value.width = desktopImage.dimensions.width;
            value.height = desktopImage.dimensions.height;
        } else {
            return null;
        }
        return value;
    }, [desktopImage, mobileImage]);

    useEffect(() => {
        if (figureRef.current) {
            const width = figureRef.current.offsetWidth;
            if (dimensions.width > width) {
                if (
                    window.matchMedia('(max-width: 48rem)').matches &&
                    mobileImage &&
                    mobileImage.dimensions
                ) {
                    dimensions.width = width;
                    dimensions.height =
                        dimensions.width * mobileImage.dimensions.ratio;
                } else if (desktopImage && desktopImage.dimensions) {
                    dimensions.width = width;
                    dimensions.height =
                        dimensions.width * desktopImage.dimensions.ratio;
                }
            }
        }
    }, [desktopImage, dimensions, mobileImage]);

    if (!dimensions) {
        return null;
    }

    return (
        <figure style={figureStyles} ref={figureRef}>
            <Shimmer
                aria-live="polite"
                aria-busy="true"
                classes={{
                    root_rectangle: [
                        classes.root,
                        classes.shimmerRoot,
                        ...cssClasses
                    ].join(' ')
                }}
                style={imageStyles}
                height={dimensions.height + 'px'}
                width={dimensions.width + 'px'}
            />
        </figure>
    );
};

/**
 * Props for {@link ImageShimmer}
 *
 * * @typedef props
 *  *
 *  * @property {Object} classes An object containing the class names for the Image
 *  * @property {String} classes.img CSS classes for the img element
 *  * @property {Object} desktopImage desktop image URL src and dimensions
 *  * @property {Object} mobileImage mobile image URL src and dimensions
 *  * @property {String} altText Alternate text
 *  * @property {String} textAlign Alignment of the divider within the parent container
 *  * @property {String} border CSS border property
 *  * @property {String} borderColor CSS border color property
 *  * @property {String} borderWidth CSS border width property
 *  * @property {String} borderRadius CSS border radius property
 *  * @property {String} marginTop CSS margin top property
 *  * @property {String} marginRight CSS margin right property
 *  * @property {String} marginBottom CSS margin bottom property
 *  * @property {String} marginLeft CSS margin left property
 *  * @property {String} paddingTop CSS padding top property
 *  * @property {String} paddingRight CSS padding right property
 *  * @property {String} paddingBottom CSS padding bottom property
 *  * @property {String} paddingLeft CSS padding left property
 *  * @property {Array} cssClasses List of CSS classes to be applied to the component
 *  */
ImageShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string,
        overlay: string,
        content: string,
        wrapper: string,
        img: string,
        mobileOnly: string
    }),
    desktopImage: shape({
        src: string,
        dimensions: shape({
            height: number,
            ratio: number,
            width: number
        })
    }),
    mobileImage: shape({
        src: string,
        dimensions: shape({
            height: number,
            ratio: number,
            width: number
        })
    }),
    altText: string,
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

export default ImageShimmer;
