import React from 'react';
import gql from 'graphql-tag';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Kebab from '../../MiniCart/kebab';
import ProductOptions from '../../MiniCart/productOptions';
import Quantity from './quantity';
import Section from '../../MiniCart/section';
import Image from '../../Image';
import defaultClasses from './product.css';
import { CartPageFragment } from '../cartPageFragments';

const IMAGE_SIZE = 100;

const Product = props => {
    const { item } = props;
    const talonProps = useProduct({
        item,
        removeItemMutation: REMOVE_ITEM_MUTATION,
        updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
    });

    const {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isFavorite,
        isUpdating,
        product
    } = talonProps;

    const { currency, image, name, options, quantity, unitPrice } = product;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isUpdating ? classes.rootMasked : classes.root;

    return (
        <li className={rootClass}>
            <Image
                alt={name}
                classes={{ image: classes.image, root: classes.imageContainer }}
                width={IMAGE_SIZE}
                resource={image}
            />
            <div className={classes.details}>
                <span className={classes.name}>{name}</span>
                <ProductOptions
                    options={options}
                    classes={{
                        options: classes.options,
                        optionLabel: classes.optionLabel
                    }}
                />
                <span className={classes.price}>
                    <Price currencyCode={currency} value={unitPrice} />
                    {' ea.'}
                </span>
                <div className={classes.quantity}>
                    <Quantity
                        item={item}
                        initialValue={quantity}
                        onChange={handleUpdateItemQuantity}
                    />
                </div>
            </div>
            <Kebab classes={{ root: classes.kebab }} disabled={true}>
                <Section
                    text={
                        isFavorite
                            ? 'Remove from favorites'
                            : 'Move to favorites'
                    }
                    onClick={handleToggleFavorites}
                    icon="Heart"
                    isFilled={isFavorite}
                    classes={{ text: classes.sectionText }}
                />
                <Section
                    text="Edit item"
                    onClick={handleEditItem}
                    icon="Edit2"
                    classes={{ text: classes.sectionText }}
                />
                <Section
                    text="Remove from cart"
                    onClick={handleRemoveFromCart}
                    icon="Trash"
                    classes={{ text: classes.sectionText }}
                />
            </Kebab>
        </li>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId }) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
