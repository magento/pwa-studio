import React, { Component } from 'react';
import { arrayOf, bool, func, number, shape, string, object } from 'prop-types';
import ProductEdit from 'src/components/ProductEdit';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Carousel from 'src/components/ProductImageCarousel';
import Quantity from 'src/components/ProductQuantity';
import RichText from 'src/components/RichText';
import defaultClasses from './productFullDetail.css';

class ProductFullDetail extends Component {
    static propTypes = {
        classes: shape({
            actions: string,
            cartActions: string,
            description: string,
            descriptionTitle: string,
            details: string,
            detailsTitle: string,
            imageCarousel: string,
            productName: string,
            productPrice: string,
            quantity: string,
            quantityTitle: string,
            root: string,
            title: string
        }),
        // TODO: Update proptypes
        product: shape({
            __typename: string.isRequired,
            id: number,
            sku: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        currency: string.isRequired,
                        value: number.isRequired
                    })
                }).isRequired
            }).isRequired,
            media_gallery_entries: arrayOf(
                shape({
                    label: string,
                    position: number,
                    disabled: bool,
                    file: string.isRequired
                })
            ),
            configurable_options: arrayOf(
                shape({
                    label: string,
                    attribute_id: string,
                    attribute_code: string,
                    position: number,
                    values: arrayOf(
                        shape({
                            label: string,
                            value_index: number
                        })
                    )
                })
            ),
            variants: arrayOf(object),
            description: string
        }).isRequired,
        addConfigurableItemToCart: func.isRequired,
        addItemToCart: func.isRequired
    };

    state = { quantity: 1 };

    setQuantity = quantity => this.setState({ quantity });

    onOptionChange = options => {
        this.setState({
            ...this.state,
            selectedOptions: {
                ...this.state.selectedOptions,
                ...options
            }
        });
    };

    get productEdit() {
        let { product } = this.props;
        const productEdit =
            product.__typename === 'ConfigurableProduct' ? (
                <ProductEdit
                    onOptionChange={this.onOptionChange}
                    item={product}
                />
            ) : null;

        return productEdit;
    }

    // TODO: Make it obey actual default values, not just the first one
    initOptions = product => {
        const options = product.configurable_options;
        const initialState = {};
        options.sort(this.sortConfigurableOptions);
        options.forEach(option => {
            initialState[option.attribute_code] = {};
        });
        this.setState({
            selectedOptions: {
                ...initialState
            }
        });
    };

    sortConfigurableOptions = (a, b) => {
        const aPosition = a.position;
        const bPosition = b.position;
        if (aPosition > bPosition) {
            return 1;
        }
        if (aPosition < bPosition) {
            return -1;
        }
        return 0;
    };

    componentWillMount() {
        let { product } = this.props;
        const isConfigurable =
            product && product.__typename === 'ConfigurableProduct';
        if (isConfigurable) {
            this.initOptions(product);
        }
    }

    getCurrentConfiguration(item, selectedOptions) {
        let currentItem = item.variants;
        const options = Object.keys(selectedOptions);
        options.forEach(option => {
            currentItem = currentItem.filter(variant => {
                const value_index = selectedOptions[option].value_index;
                const product_index = parseInt(variant.product[option]);
                let isValuePresent = !!(product_index === value_index);
                return isValuePresent;
            });
        });
        currentItem = !!currentItem[0] ? currentItem[0].product : null;
        return currentItem;
    }

    addConfigurableToCart = async () => {
        // For REST endpoint
        // Takes in an an array of option_values and option_ids
        const { product } = this.props;
        const { quantity } = this.state;

        const options = product.configurable_options.map(option => {
            return {
                option_value: this.state.selectedOptions[option.attribute_code]
                    .value_index,
                option_id: option.attribute_id
            };
        });
        const currentItem = this.getCurrentConfiguration(
            product,
            this.state.selectedOptions
        );
        const parentSKU = product.sku;
        currentItem.options = options;
        await this.props.addConfigurableItemToCart({
            parentSKU,
            currentItem,
            quantity
        });
    };

    addToCart = async () => {
        const { product } = this.props;
        const { quantity } = this.state;

        await this.props.addItemToCart({ product, quantity });
    };

    get stockMessage() {
        let { product, classes } = this.props;
        const currentProduct = this.getCurrentConfiguration(
            product,
            this.state.selectedOptions
        );
        const stockMessage =
            currentProduct && currentProduct.stock_status === 'OUT_OF_STOCK'
                ? 'Product not in stock'
                : null;
        return <p className={classes.stockMessage}> {stockMessage} </p>;
    }

    render() {
        const { classes, product } = this.props;
        const {
            stockMessage,
            productEdit,
            addItemToCart,
            addConfigurableToCart
        } = this;
        const { regularPrice } = product.price;

        let onAddToCart = addItemToCart;
        if (product.__typename === 'ConfigurableProduct') {
            onAddToCart = addConfigurableToCart;
        }

        return (
            <article className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        <span>{product.name}</span>
                    </h1>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={regularPrice.amount.currency}
                            value={regularPrice.amount.value}
                        />
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    <Carousel images={product.media_gallery_entries} />
                </section>
                <section className={classes.edit}>
                    {productEdit}
                    {stockMessage}
                </section>
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>
                        <span>Quantity</span>
                    </h2>
                    <Quantity
                        value={this.state.quantity}
                        onChange={this.setQuantity}
                    />
                </section>
                <section className={classes.actions}>
                    <Button>
                        <span>Add to Wishlist</span>
                    </Button>
                </section>
                <section className={classes.cartActions}>
                    <Button onClick={onAddToCart}>
                        <span>Add to Cart</span>
                    </Button>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <span>Product Description</span>
                    </h2>
                    <RichText content={product.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>
                        <span>SKU</span>
                    </h2>
                    <strong>{product.sku}</strong>
                </section>
            </article>
        );
    }
}

export default classify(defaultClasses)(ProductFullDetail);
