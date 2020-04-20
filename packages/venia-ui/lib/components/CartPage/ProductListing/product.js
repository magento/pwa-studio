import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import { Price, useToasts } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Kebab from '../../MiniCart/kebab';
import ProductOptions from '../../MiniCart/productOptions';
import Quantity from './quantity';
import Section from '../../MiniCart/section';
import Icon from '../../Icon';
import Image from '../../Image';
import defaultClasses from './product.css';
import { CartPageFragment } from '../cartPageFragments.gql';
import { AvailableShippingMethodsFragment } from '../PriceAdjustments/ShippingMethods/shippingMethodsFragments';
const IMAGE_SIZE = 100;

const errorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const Product = props => {
    const { item, setActiveEditItem, setIsCartUpdating } = props;
    const talonProps = useProduct({
        item,
        mutations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        setActiveEditItem,
        setIsCartUpdating
    });

    const {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable,
        isFavorite,
        product,
        updateItemErrorMessage
    } = talonProps;

    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (updateItemErrorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: updateItemErrorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, updateItemErrorMessage]);

    const { currency, image, name, options, quantity, unitPrice } = product;

    const classes = mergeClasses(defaultClasses, props.classes);

    const editItemSection = isEditable ? (
        <Section
            text="Edit item"
            onClick={handleEditItem}
            icon="Edit2"
            classes={{ text: classes.sectionText }}
        />
    ) : null;

    return (
        <li className={classes.root}>
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
                        itemId={item.id}
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
                {editItemSection}
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
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsFragment}
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
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsFragment}
`;
