import React from 'react';
import { arrayOf, shape, string, object } from 'prop-types';
import defaultClasses from './dynamicBlock.shimmer.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

/**
 * Page Builder Dynamic Block Shimmer component.
 *
 * @typedef DynamicBlockShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Dynamic Block Shimmer.
 */
const DynamicBlockShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        border,
        borderWidth,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        minHeight,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const rootStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        minHeight
    };

    const wrapperStyles = {
        border,
        borderWidth,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    // Only render shimmer if min-height specified
    return minHeight ? (
        <div
            className={classes.parent}
            style={rootStyles}
            aria-live="polite"
            aria-busy="true"
        >
            <Shimmer
                classes={{
                    root_rectangle: [
                        classes.root,
                        classes.shimmerRoot,
                        ...cssClasses
                    ].join(' ')
                }}
            >
                <div className={classes.wrapper} style={wrapperStyles}>
                    <div className={classes.overlay}>
                        <div className={classes.content} />
                    </div>
                </div>
            </Shimmer>
        </div>
    ) : null;
};

/**
 * Props for {@link DynamicBlockShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the dynamic block
 * @property {String} classes.root CSS class for the dynamic block root element
 * @property {String} classes.shimmerRoot CSS class for the dynamic block
 * shimmer root_rectangle element
 * @property {String} classes.wrapper CSS class for the dynamic block wrapper element
 * @property {String} classes.overlay CSS class for the dynamic block overlay element
 * @property {String} classes.content CSS class for the dynamic block content element
 * @property {String} minHeight CSS minimum height property
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
 * @property {Array} cssClasses List of CSS classes to be applied to
 * the component
 */
DynamicBlockShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string,
        parent: string,
        wrapper: string,
        overlay: string,
        content: string
    }),
    minHeight: string,
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

export default DynamicBlockShimmer;
