import React, { Component, Fragment } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import Kebab from './kebab';
import Section from './section';
import ResponsiveImage from 'src/components/ResponsiveImage';

import classify from 'src/classify';
import defaultClasses from './product.css';

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

    render() {
        const { options, props, modal } = this;
        const { classes, item, currencyCode } = props;
        const rootClasses = this.state.isOpen
            ? classes.root + ' ' + classes.root_masked
            : classes.root;
        const favoritesFill = { fill: 'rgb(var(--venia-teal))' };

        return (
            <li className={rootClasses}>
                {
                    <ResponsiveImage
                        alt={item.name}
                        className={classes.thumbnailImage}
                        sizes="80px"
                        src={(item.image && item.image.file) || ''}
                        type="product"
                        widthOptions={[160, 80]}
                        render={(renderImage, setToUrl) => {
                            return (
                                <div
                                    className={classes.thumbnail}
                                    ref={setToUrl('background-image')}
                                >
                                    {renderImage()}
                                </div>
                            );
                        }}
                    />
                }
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
                <Kebab>
                    <Section
                        text="Add to favorites"
                        onClick={this.favoriteItem}
                        icon="Heart"
                        iconAttributes={
                            this.state.isFavorite ? favoritesFill : ''
                        }
                    />
                    <Section
                        text="Edit item"
                        onClick={this.editItem}
                        icon="Edit2"
                    />
                    <Section
                        text="Remove item"
                        onClick={this.removeItem}
                        icon="Trash"
                    />
                </Kebab>
            </li>
        );
    }

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
