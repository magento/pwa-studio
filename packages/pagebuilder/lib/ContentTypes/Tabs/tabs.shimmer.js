import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './tabs.shimmer.module.css';

/**
 * Page Builder Tabs Shimmer component.
 *
 * @typedef TabsShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Tabs Shimmer.
 */
const TabsShimmer = props => {
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

    const wrapperStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const contentStyles = {
        minHeight
    };

    if (border) {
        wrapperStyles['--tabs-border'] = border;
    }
    if (borderWidth) {
        wrapperStyles['--tabs-border-width'] = borderWidth;
    }

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
            style={wrapperStyles}
        >
            <ul className={classes.navigation}>
                <li className={classes.header}>
                    <span>&nbsp;</span>
                </li>
            </ul>
            <div className={classes.content} style={contentStyles} />
        </Shimmer>
    );
};

/**
 * Props for {@link TabsShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the tabs
 * @property {String} classes.root CSS class for the tabs root element
 * @property {String} classes.shimmerRoot CSS class for the tabs
 * shimmer root_rectangle element
 * @property {String} classes.navigation CSS class for the tabs navigation element
 * @property {String} classes.header CSS class for the tabs header element
 * @property {String} classes.content CSS class for the tabs content element
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
TabsShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string,
        navigation: string,
        header: string,
        content: string
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

export default TabsShimmer;
