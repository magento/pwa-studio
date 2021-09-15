import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './video.shimmer.css';

/**
 * Page Builder Video Shimmer component.
 *
 * @typedef VideoShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Video Shimmer.
 */
const VideoShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        maxWidth,
        border,
        borderWidth,
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

    const mainStyles = {
        maxWidth,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };

    const wrapperStyles = {
        border,
        borderWidth,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

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
            style={mainStyles}
        >
            <div className={classes.inner}>
                <div style={wrapperStyles} className={classes.wrapper}>
                    <div className={classes.container} />
                </div>
            </div>
        </Shimmer>
    );
};

/**
 * Props for {@link VideoShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the video
 * @property {String} classes.root CSS class for the video root element
 * @property {String} classes.shimmerRoot CSS class for the video shimmer
 * root_rectangle element
 * @property {String} classes.inner CSS classes for the inner container element
 * @property {String} classes.wrapper CSS classes for the wrapper container element
 * @property {String} classes.container CSS classes for the container element
 * @property {String} maxWidth Maximum width of the video
 * @property {String} border CSS border property
 * @property {String} borderWidth CSS border width property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to
 * the component
 */
VideoShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string,
        inner: string,
        wrapper: string,
        container: string
    }),
    maxWidth: string,
    border: string,
    borderWidth: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default VideoShimmer;
