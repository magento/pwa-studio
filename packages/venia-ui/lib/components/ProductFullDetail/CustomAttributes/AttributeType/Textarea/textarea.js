import React, { Fragment } from 'react';
import { bool, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import defaultClasses from './textarea.module.css';

/**
 * Custom Attributes Textarea Type component.
 *
 * @typedef Textarea
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Textarea Type Product Attribute.
 */
const Textarea = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        attribute_metadata = {},
        entered_attribute_value = {},
        showLabels = true
    } = props;

    const attributeLabel =
        attribute_metadata.label && showLabels ? (
            <div className={classes.label}>{attribute_metadata.label}</div>
        ) : null;
    let attributeContent;

    if (entered_attribute_value.value) {
        const { is_html_allowed: isHtml } = attribute_metadata.ui_input;

        if (isHtml) {
            // TODO: Get decoded wysiwyg widgets from GraphQl

            attributeContent = (
                <div className={classes.contentHtml}>
                    <RichContent html={entered_attribute_value.value} />
                </div>
            );
        } else {
            attributeContent = (
                <div className={classes.content}>
                    {entered_attribute_value.value}
                </div>
            );
        }
    }

    return (
        <Fragment>
            {attributeLabel}
            {attributeContent}
        </Fragment>
    );
};

/**
 * Props for {@link Textarea}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the attribute
 * @property {String} classes.label CSS class for the attribute label
 * @property {String} classes.content CSS class for the attribute content
 * @property {String} classes.contentHtml CSS class for the attribute content containing html
 * @property {Object} attribute_metadata An object containing the attribute metadata
 * @property {String} attribute_metadata.label The attribute label
 * @property {Object} attribute_metadata.ui_input An object containing the input ui data
 * @property {Boolean} attribute_metadata.ui_input.is_html_allowed Indicates if value might contain html
 * @property {Object} entered_attribute_value An object containing the attribute value
 * @property {String} entered_attribute_value.value Attribute value
 */
Textarea.propTypes = {
    classes: shape({
        label: string,
        content: string,
        contentHtml: string
    }),
    attribute_metadata: shape({
        label: string,
        ui_input: shape({
            is_html_allowed: bool
        })
    }),
    entered_attribute_value: shape({
        value: string
    })
};

export default Textarea;
