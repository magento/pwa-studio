import React from 'react';
import { arrayOf, bool, number, oneOf, shape, string } from 'prop-types';
import SlickSlider from 'react-slick';
import defaultClasses from './slider.css';
import { mergeClasses } from '../../../../../classify';

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
    const classes = mergeClasses(defaultClasses, props.classes);

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
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        children
    } = props;

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

    const sliderSettings = {
        dots: showDots,
        arrows: showArrows,
        infinite,
        autoplay,
        autoplaySpeed,
        fade
    };

    return (
        <SlickSlider
            className={classes.root}
            style={dynamicStyles}
            {...sliderSettings}
        >
            {children}
        </SlickSlider>
    );
};

/**
 * Props for {@link Slider}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Row
 * @property {String} classes.contained CSS class for the contained appearance element
 * @property {String} classes.root CSS class for the row root element
 * @property {String} minHeight CSS minimum height property
 * @property {String} autoplay Whether the slider should autoplay
 * @property {String} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {String} fade Fade between slides
 * @property {String} infinite Whether to infinitely scroll the slider
 * @property {String} showArrows Whether to show arrows on the slide for navigation
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 * @property {String} textAlign Alignment of content within the row
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Slider.propTypes = {
    classes: shape({
        root: string,
        contained: string
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
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

export default Slider;
