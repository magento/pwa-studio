import React, { Component, Fragment } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
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
            modal: string,
            name: string,
            optionLabel: string,
            options: string,
            price: string,
            quantity: string,
            quantityOperator: string,
            quantityRow: string,
            quantitySelect: string,
            root: string
        }),
        item: shape({
            item_id: number.isRequired,
            name: string.isRequired,
            options: arrayOf(
                shape({
                    label: string,
                    value: string
                })
            ),
            price: number.isRequired,
            product_type: string,
            qty: number.isRequired,
            quote_id: string,
            sku: string.isRequired
        }).isRequired,
        currencyCode: string.isRequired,
        totalsItems: arrayOf(
            shape({
                base_discount_amount: number,
                base_price: number,
                base_price_incl_tax: number,
                base_row_total: number,
                base_row_total_incl_tax: number,
                base_tax_amount: number,
                discount_amount: number,
                discount_percent: number,
                item_id: number.isRequired,
                name: string,
                options: string,
                price: number,
                price_incl_tax: number,
                qty: number,
                row_total: number,
                row_total_incl_tax: number,
                row_total_with_discount: number,
                tax_amount: number,
                tax_percent: number,
                weee_tax_applied: bool,
                weee_tax_applied_amount: number
            })
        ).isRequired
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
        const options = item.options;

        return options && options.length > 0 ? (
            <dl className={classes.options}>
                {options.map(({ label, value }) => (
                    <Fragment key={`${label}${value}`}>
                        <dt className={classes.optionLabel}>
                            {label} : {value}
                        </dt>
                    </Fragment>
                ))}
            </dl>
        ) : null;
    }

    get modal() {
        const { classes } = this.props;
        return this.state.isOpen ? <div className={classes.modal} /> : null;
    }

    styleImage(image) {
        return {
            minHeight: imageHeight, // min-height instead of height so image will always align with grid bottom
            width: imageWidth,
            backgroundImage: `url(${makeProductMediaPath(image.file)})`
        };
    }

    render() {
        const { options, props, modal } = this;
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
                    <div className={classes.quantityRow}>
                        <select
                            className={classes.quantitySelect}
                            value={item.qty}
                            readOnly
                        >
                            <option value={item.qty}>{item.qty}</option>
                        </select>
                        <span className={classes.quantityOperator}>{'×'}</span>
                        <span className={classes.price}>
                            <Price
                                currencyCode={currencyCode}
                                value={item.price}
                            />
                        </span>
                    </div>
                </div>
                {modal}
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
