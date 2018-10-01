import React, { Component, Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import defaultClasses from './product.css';

const imageWidth = 80;
const imageHeight = 100;

class Product extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            name: string,
            optionName: string,
            optionValue: string,
            options: string,
            price: string,
            quantity: string,
            quantityOperator: string,
            quantitySelect: string,
            root: string
        }),
        item: shape({
            item_id: number.isRequired,
            name: string.isRequired,
            price: number.isRequired,
            product_type: string,
            qty: number.isRequired,
            quote_id: string,
            sku: string.isRequired
        }).isRequired,
        currencyCode: string.isRequired
    };

    get options() {
        const { classes, item } = this.props;

        return item.options && item.options.length > 0 ? (
            <dl className={this.props.classes.options}>
                {item.options.map(({ name, value }) => (
                    <Fragment key={name}>
                        <dt className={classes.optionName}>{name}</dt>
                        <dd className={classes.optionValue}>{value}</dd>
                    </Fragment>
                ))}
            </dl>
        ) : null;
    }

    styleImage(image) {
        return {
            height: imageHeight,
            width: imageWidth,
            backgroundImage: `url(${makeProductMediaPath(image.file)})`
        };
    }

    render() {
        const { options, props } = this;
        const { classes, item, currencyCode } = props;

        return (
            <li className={classes.root}>
                <div
                    className={classes.image}
                    style={this.styleImage(item.image)}
                />
                <div className={classes.name}>{item.name}</div>
                {options}
                <div className={classes.quantity}>
                    <select
                        className={classes.quantitySelect}
                        value={item.qty}
                        readOnly
                    >
                        <option value={item.qty}>{item.qty}</option>
                    </select>
                    <span className={classes.quantityOperator}>{'×'}</span>
                    <span className={classes.price}>
                        <Price currencyCode={currencyCode} value={item.price} />
                    </span>
                </div>
            </li>
        );
    }
}

export default classify(defaultClasses)(Product);
