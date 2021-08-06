import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import defaultClasses from './banner.shimmer.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

/**
 * Page Builder Banner Shimmer component.
 *
 * @typedef BannerShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Banner Shimmer.
 */
const BannerShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        minHeight,
        border,
        borderWidth,
        marginTop = 0,
        marginRight = 0,
        marginBottom = 0,
        marginLeft = 0,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const shimmerStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };

    const rootStyles = {
        minHeight,
        border,
        borderWidth,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    return (
        <Shimmer
            classes={{
                root_rectangle: classes.shimmerRoot,
                content: classes.shimmerContent
            }}
            style={shimmerStyles}
        >
            <div
                aria-live="polite"
                aria-busy="true"
                className={[classes.root, ...cssClasses].join(' ')}
                style={rootStyles}
            />
        </Shimmer>
    );
};

/**
 * Props for {@link BannerShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the banner
 * @property {String} classes.root CSS class for the banner root element
 * @property {String} classes.shimmerRoot CSS class for the banner
 * shimmer root_rectangle element
 * @property {String} classes.shimmerContent CSS class for the banner
 * shimmer content element
 * @property {String} minHeight CSS minimum height property
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
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
BannerShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string,
        shimmerContent: string
    }),
    minHeight: string,
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

export default BannerShimmer;
