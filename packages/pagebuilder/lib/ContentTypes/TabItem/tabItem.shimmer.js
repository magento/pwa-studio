import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './tabItem.shimmer.css';

/**
 * Page Builder Tab Item Shimmer component.
 *
 * @typedef TabItemShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Tab Item Shimmer.
 */
const TabItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        minHeight,
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

    const dynamicStyles = {
        minHeight,
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
        />
    );
};

/**
 * Props for {@link TabItemShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * tab item
 * @property {String} classes.root CSS class for the tab item root element
 * @property {String} classes.shimmerRoot CSS class for the tab item
 * shimmer root_rectangle element
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
 * @property {Array} cssClasses List of CSS classes to be applied to
 * the component
 */
TabItemShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string
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

export default TabItemShimmer;
