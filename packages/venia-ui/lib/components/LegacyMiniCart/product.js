import React, { useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProduct } from '@magento/peregrine/lib/talons/LegacyMiniCart/useProduct';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import { useStyle } from '../../classify';
import Image from '../Image';
import { REMOVE_ITEM_MUTATION } from './cartOptions.gql';
import Kebab from './kebab';
import defaultClasses from './product.module.css';
import ProductOptions from './productOptions';
import Section from './section';
import { gql } from '@apollo/client';

const QUANTITY_OPERATOR = '×';

const PRODUCT_IMAGE_WIDTH = 80;

const Product = props => {
    const { beginEditItem, currencyCode, item } = props;

    const talonProps = useProduct({
        beginEditItem,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        item,
        removeItemMutation: REMOVE_ITEM_MUTATION
    });

    const {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        isFavorite,
        isLoading,
        productImage,
        productName,
        productOptions,
        productPrice,
        productQuantity
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const productImageComponent = useMemo(() => {
        const imageProps = {
            alt: productName,
            classes: { image: classes.image, root: classes.imageContainer },
            width: PRODUCT_IMAGE_WIDTH
        };

        if (!productImage) {
            imageProps.src = transparentPlaceholder;
        } else {
            imageProps.resource = productImage;
        }

        return <Image {...imageProps} />;
    }, [classes.image, classes.imageContainer, productImage, productName]);

    const mask = isLoading ? <div className={classes.mask} /> : null;

    return (
        <li className={classes.root}>
            {productImageComponent}
            <div className={classes.name}>{productName}</div>
            <ProductOptions options={productOptions} />
            <div className={classes.quantity}>
                <div className={classes.quantityRow}>
                    <span>{productQuantity}</span>
                    <span className={classes.quantityOperator}>
                        {QUANTITY_OPERATOR}
                    </span>
                    <span className={classes.price}>
                        <Price
                            currencyCode={currencyCode}
                            value={productPrice}
                        />
                    </span>
                </div>
            </div>
            {mask}
            <Kebab>
                <Section
                    text="Add to favorites"
                    onClick={handleFavoriteItem}
                    icon="Heart"
                    isFilled={isFavorite}
                />
                <Section
                    text="Edit item"
                    onClick={handleEditItem}
                    icon="Edit2"
                />
                <Section
                    text="Remove item"
                    onClick={handleRemoveItem}
                    icon="Trash"
                />
            </Kebab>
        </li>
    );
};

Product.propTypes = {
    beginEditItem: func.isRequired,
    currencyCode: string,
    item: shape({
        image: shape({
            file: string
        }),
        name: string,
        options: array,
        price: number,
        qty: number
    }).isRequired
};

export default Product;

export const CREATE_CART_MUTATION = gql`
    mutation CreateCartWithProduct {
        cartId: createEmptyCart
    }
`;

export const GET_CART_DETAILS_QUERY = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                uid
                prices {
                    price {
                        value
                    }
                }
                product {
                    id
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        id
                        option_label
                        value_id
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
        }
    }
`;
