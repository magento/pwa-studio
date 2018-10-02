import React, { Component, Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import Kebab from './kebab';
import Section from './section';

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

    // TODO: Manage favorite items using GraphQL/REST when it is ready
    constructor() {
        super();
        this.state = {
            isOpen: false,
            isFavorite: false
        };
    }

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
        const rootClasses = this.state.isOpen
            ? classes.root + ' ' + classes.root_masked
            : classes.root;
        const favoritesFill = { fill: 'rgb(var(--venia-teal))' };

        return (
            <li className={rootClasses}>
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
                <div className={this.state.isOpen ? classes.modal : ''} />
                <Kebab
                    onFocus={this.openDropdown}
                    onBlur={this.closeDropdown}
                    isOpen={this.state.isOpen}
                >
                    <Section
                        text="Add to favorites"
                        onClick={this.favoriteItem}
                        icon="heart"
                        iconAttributes={
                            this.state.isFavorite ? favoritesFill : ''
                        }
                    />
                    <Section
                        text="Edit item"
                        onClick={this.editItem}
                        icon="edit-2"
                    />
                    <Section
                        text="Remove item"
                        onClick={this.removeItem}
                        icon="trash"
                    />
                </Kebab>
            </li>
        );
    }

    openDropdown = () => {
        this.setState({
            isOpen: true
        });
    };

    closeDropdown = () => {
        this.setState({
            isOpen: false
        });
    };

    favoriteItem = () => {
        this.setState({
            isFavorite: true
        });
    };

    editItem = () => {
        this.props.showEditPanel(this.props.item);
    };

    removeItem = () => {
        // TODO: prompt user to confirm this action
        this.props.removeItemFromCart({
            item: this.props.item
        });
    };
}

export default classify(defaultClasses)(Product);
