import React, { Children } from 'react';
import {
    arrayOf,
    bool,
    number,
    oneOf,
    shape,
    string,
    object
} from 'prop-types';
import SlickSlider from 'react-slick';
import defaultClasses from './slider.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useMediaQuery } from '@magento/peregrine/lib/hooks/useMediaQuery';
import { jarallax } from 'jarallax';

/**
 * Page Builder Slider component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Slider
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Slider which contains slides.
 */
const Slider = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        minHeight,
        autoplay,
        autoplaySpeed,
        fade,
        infinite,
        showArrows,
        showDots,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        mediaQueries,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        children
    } = props;

    const { styles: mediaQueryStyles } = useMediaQuery({ mediaQueries });

    const dynamicStyles = {
        minHeight,
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
        paddingLeft
    };
    const jarallaxInstances = {};
    const sliderSettings = {
        dots: showDots,
        arrows: showArrows,
        lazyLoad: 'ondemand',
        afterChange: () => {
            Object.keys(jarallaxInstances).map(key => {
                jarallax(jarallaxInstances[key].element, 'onScroll');
            });
        },
        infinite,
        autoplay,
        autoplaySpeed,
        fade
    };

    // Override classes on banner to ensure min height is respected
    Children.map(children, (child, index) => {
        if (child.props && child.props.data) {
            child.props.data.classes = {
                root: classes.bannerRoot,
                link: classes.bannerLink,
                wrapper: classes.bannerWrapper,
                posterOverlay: classes.bannerPosterOverlay
            };
            child.props.data.getParallax = (element, options) => {
                jarallaxInstances[index] = {
                    element,
                    options
                };
            };
        }
        return child;
    });

    return (
        <div
            aria-live="polite"
            aria-busy="false"
            className={[classes.root, ...cssClasses].join(' ')}
            style={{ ...dynamicStyles, ...mediaQueryStyles }}
        >
            <SlickSlider {...sliderSettings}>{children}</SlickSlider>
        </div>
    );
};

/**
 * Props for {@link Slider}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Slider
 * @property {String} classes.root CSS class for the slider root element
 * @property {String} classes.bannerRoot CSS class for the child banner item
 * @property {String} classes.bannerLink CSS class for the child banner item
 * @property {String} classes.bannerWrapper CSS class for the child banner item
 * @property {String} classes.bannerPosterOverlay CSS class for the child banner item
 * @property {String} minHeight CSS minimum height property
 * @property {String} autoplay Whether the slider should autoplay
 * @property {String} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {String} fade Fade between slides
 * @property {String} infinite Whether to infinitely scroll the slider
 * @property {String} showArrows Whether to show arrows on the slide for navigation
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 * @property {String} textAlign Alignment of content within the slider
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
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
Slider.propTypes = {
    classes: shape({
        root: string,
        bannerRoot: string,
        bannerLink: string,
        bannerWrapper: string,
        bannerPosterOverlay: string
    }),
    appearance: oneOf(['default']),
    minHeight: string,
    autoplay: bool,
    autoplaySpeed: number,
    fade: bool,
    infinite: bool,
    showArrows: bool,
    showDots: bool,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
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

export default Slider;
