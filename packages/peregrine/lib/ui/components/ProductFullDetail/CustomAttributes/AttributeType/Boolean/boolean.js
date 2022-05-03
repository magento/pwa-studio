import React, { Fragment } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './boolean.module.css';

/**
 * Custom Attributes Boolean Type component.
 *
 * @typedef Boolean
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Boolean Type Product Attribute.
 */
const Boolean = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { attribute_metadata = {}, selected_attribute_options = {} } = props;

    const attributeLabel = attribute_metadata.label ? (
        <div className={classes.label}>{attribute_metadata.label}</div>
    ) : null;
    let attributeContent;

    if (selected_attribute_options.attribute_option?.length > 0) {
        const options = selected_attribute_options.attribute_option
            .map(option => option.label)
            .join(', ');

        attributeContent = <div className={classes.content}>{options}</div>;
    }

    return (
        <Fragment>
            {attributeLabel}
            {attributeContent}
        </Fragment>
    );
};

/**
 * Props for {@link Boolean}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the attribute
 * @property {String} classes.label CSS class for the attribute label
 * @property {String} classes.content CSS class for the attribute content
 * @property {Object} attribute_metadata An object containing the attribute metadata
 * @property {String} attribute_metadata.label The attribute label
 * @property {Object} selected_attribute_options An object containing the attribute selected options
 * @property {Array} selected_attribute_options.attribute_option An array of the selected options
 * @property {String} selected_attribute_options.attribute_option.label Label of the selected option
 */
Boolean.propTypes = {
    classes: shape({
        label: string,
        content: string
    }),
    attribute_metadata: shape({
        label: string
    }),
    selected_attribute_options: shape({
        attribute_option: arrayOf(
            shape({
                label: string
            })
        )
    })
};

export default Boolean;
