import React, { Component, Fragment } from 'react';
import { arrayOf, func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import { resourceUrl } from 'src/drivers';
import Kebab from './kebab';
import Section from './section';
import classify from 'src/classify';
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
        openOptionsDrawer: func.isRequired
    };

    // TODO: Manage favorite items using GraphQL/REST when it is ready
    constructor() {
        super();
        this.state = {
            isLoading: false,
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

    get mask() {
        const { classes } = this.props;
        return this.state.isLoading ? <div className={classes.mask} /> : null;
    }

    styleImage(image) {
        return {
            minHeight: imageHeight, // min-height instead of height so image will always align with grid bottom
            width: imageWidth,
            backgroundImage: `url(${resourceUrl(image.file, {
                type: 'image-product',
                width: imageWidth
            })})`
        };
    }

    render() {
        const { options, props, mask } = this;
        const { classes, item, currencyCode } = props;
        const favoritesFill = { fill: 'rgb(var(--venia-teal))' };

        return (
            <li className={classes.root}>
                <div
                    className={classes.image}
                    style={this.styleImage(item.image)}
                />
                <div className={classes.name}>{item.name}</div>
                {options}
                <div className={classes.quantity}>
                    <div className={classes.quantityRow}>
                        <span>{item.qty}</span>
                        <span className={classes.quantityOperator}>{'×'}</span>
                        <span className={classes.price}>
                            <Price
                                currencyCode={currencyCode}
                                value={item.price}
                            />
                        </span>
                    </div>
                </div>
                {mask}
                <Kebab>
                    <Section
                        text="Add to favorites"
                        onClick={this.favoriteItem}
                        icon="Heart"
                        iconAttributes={
                            this.state.isFavorite ? favoritesFill : {}
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
        this.props.openOptionsDrawer(this.props.item);
    };

    removeItem = () => {
        this.setState({
            isLoading: true
        });

        // TODO: prompt user to confirm this action
        this.props.removeItemFromCart({
            item: this.props.item
        });
    };
}

export default classify(defaultClasses)(Product);
