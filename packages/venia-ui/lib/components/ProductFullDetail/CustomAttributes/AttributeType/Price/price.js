import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useStyle } from '@magento/venia-ui/lib/classify';
import PriceComponent from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './price.module.css';

const storage = new BrowserPersistence();

/**
 * Custom Attributes Price Type component.
 *
 * @typedef Price
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Price Type Product Attribute.
 */
const Price = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { attribute_metadata = {}, entered_attribute_value = {} } = props;

    // TODO: Get complete price data from GraphQl including currency
    const storeCurrency = storage.getItem('store_view_currency') || 'USD';
    const attributeLabel = attribute_metadata.label ? (
        <div className={classes.label}>{attribute_metadata.label}</div>
    ) : null;
    const attributeContent = entered_attribute_value.value ? (
        <div className={classes.attributeContent}>
            <PriceComponent
                value={parseInt(entered_attribute_value.value)}
                currencyCode={storeCurrency}
            />
        </div>
    ) : null;

    return (
        <Fragment>
            {attributeLabel}
            {attributeContent}
        </Fragment>
    );
};

/**
 * Props for {@link Price}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the attribute
 * @property {String} classes.label CSS class for the attribute label
 * @property {String} classes.content CSS class for the attribute content
 * @property {Object} attribute_metadata An object containing the attribute metadata
 * @property {String} attribute_metadata.label The attribute label
 * @property {Object} entered_attribute_value An object containing the attribute value
 * @property {String} entered_attribute_value.value Attribute value
 */
Price.propTypes = {
    classes: shape({
        label: string,
        content: string
    }),
    attribute_metadata: shape({
        label: string
    }),
    entered_attribute_value: shape({
        value: string
    })
};

export default Price;
