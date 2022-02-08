import React from 'react';
import { arrayOf, bool, shape, string, object } from 'prop-types';
import defaultClasses from './slider.shimmer.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { useMediaQuery } from '@magento/peregrine/lib/hooks/useMediaQuery';

/**
 * Page Builder Slider Shimmer component.
 *
 * @typedef SliderShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Slider Shimmer.
 */
const SliderShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        minHeight,
        showDots,
        border,
        borderWidth,
        marginTop = 0,
        marginRight = 0,
        marginBottom = 0,
        marginLeft = 0,
        mediaQueries,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const { styles: mediaQueryStyles } = useMediaQuery({ mediaQueries });

    const dynamicStyles = {
        minHeight: mediaQueryStyles?.minHeight || minHeight,
        border,
        borderWidth,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const dotsContainer = showDots ? <div className="slick-dots" /> : null;

    return (
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
            style={dynamicStyles}
        >
            <div className="slick-slider">
                <div className="slick-list" />
                {dotsContainer}
            </div>
        </Shimmer>
    );
};

/**
 * Props for {@link SliderShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Slider
 * @property {String} classes.root CSS class for the slider root element
 * @property {String} classes.shimmerRoot CSS class for the slider shimmer
 * root_rectangle element
 * @property {String} minHeight CSS minimum height property
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 * @property {String} border CSS border property
 * @property {String} borderWidth CSS border width property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {Array} mediaQueries List of media query rules to be applied to the component
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
SliderShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string
    }),
    minHeight: string,
    showDots: bool,
    border: string,
    borderWidth: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    mediaQueries: arrayOf(
        shape({
            media: string,
            style: object
        })
    ),
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default SliderShimmer;
