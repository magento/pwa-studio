import React, { useState } from 'react';

import defaultClasses from './itemCard.module.css';
import { usePdfPopupProduct } from '../../talons/PdfPopupProduct/usePdfPopupProduct';
import { gql } from '@apollo/client';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';

const ItemCard = props => {
    const { item, tooglePrice } = props;
    const [itemPrice, setItemPrice] = useState(item.prices.price.value);
    const [currency, setCurrency] = useState(item.prices.price.currency);

    const talonProps = usePdfPopupProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });
    const { product } = talonProps;
    const { image } = product;

    return (
        <main className={defaultClasses.container}>
            <article className={defaultClasses.imgContainer}>
                <img src={image} alt="" />
            </article>
            <section>
                {item.configurable_options.map((individualOption, index) => {
                    return (
                        <article key={index} className={defaultClasses.optionsContainer}>
                            <article>{individualOption.option_label}:</article>
                            <article>{individualOption.value_label}</article>
                        </article>
                    );
                })}
            </section>
            <section className={defaultClasses.priceContainer}>
                {!tooglePrice ? (
                    <span> {itemPrice}</span>
                ) : (
                    <input
                        className={defaultClasses.inputPrice}
                        type="text"
                        value={itemPrice}
                        onChange={e => setItemPrice(e.target.value)}
                    />
                )}
                <span>{currency}</span>
            </section>
        </main>
    );
};

export default ItemCard;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: ID!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $itemId }) @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity($cartId: String!, $itemId: ID!, $quantity: Float!) {
        updateCartItems(input: { cart_id: $cartId, cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }] })
            @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
