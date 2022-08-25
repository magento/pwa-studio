import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import { appendOptionsToPayload } from '../../util/appendOptionsToPayload';
import { isProductConfigurable } from '../../util/isProductConfigurable';

const isItemMissingOptions = (cartItem, configItem, numSelections) => {
    // Non-configurable products can't be missing options
    if (cartItem.product_type !== 'configurable') {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = configItem;
    const numProductOptions = configurable_options.length;

    return numSelections < numProductOptions;
};

export const useCartOptions = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        cartItem,
        configItem,
        createCartMutation,
        endEditItem,
        getCartDetailsQuery,
        removeItemMutation,
        updateItemMutation
    } = props;

    const {
        configurable_options: cartItemOptions,
        product,
        quantity: qty
    } = cartItem;
    const { name, price } = product;
    const { regularPrice } = price;
    const { amount } = regularPrice;
    const initialQuantity = qty;

    const [, { updateItemInCart }] = useCartContext();

    const [addConfigurableProductToCart] = useMutation(
        addConfigurableProductToCartMutation
    );
    const [addSimpleProductToCart] = useMutation(
        addSimpleProductToCartMutation
    );
    const [fetchCartId] = useMutation(createCartMutation);
    const [removeItem] = useMutation(removeItemMutation);
    const [updateItem] = useMutation(updateItemMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const initialOptionSelections = useMemo(() => {
        const result = new Map();

        if (cartItemOptions) {
            cartItemOptions.forEach(cartItemOption => {
                result.set(cartItemOption.id, cartItemOption.value_id);
            });
        }

        return result;
    }, [cartItemOptions]);

    const [optionSelections, setOptionSelections] = useState(
        initialOptionSelections
    );

    const [quantity, setQuantity] = useState(initialQuantity);

    const handleCancel = useCallback(() => {
        endEditItem();
    }, [endEditItem]);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            // There's a type difference in configurable option queries between
            // cart and product, casting to number is required. Can remove
            // cast once MC-29839 is resolved.
            nextOptionSelections.set(Number(optionId), selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const handleUpdate = useCallback(async () => {
        // configItem is the updated item with new option selections
        // cartItem is the item currently in cart
        const payload = {
            item: configItem,
            productType: configItem.__typename,
            quantity,
            cartItemId: cartItem.id
        };

        if (isProductConfigurable(configItem)) {
            appendOptionsToPayload(payload, optionSelections);
        }

        // Provide the proper addItemMutation for the product type.
        let addItemMutation;
        if (payload.productType === 'ConfigurableProduct') {
            addItemMutation = addConfigurableProductToCart;
        } else {
            addItemMutation = addSimpleProductToCart;
        }

        await updateItemInCart({
            ...payload,
            addItemMutation,
            fetchCartDetails,
            fetchCartId,
            removeItem,
            updateItem
        });
        endEditItem();
    }, [
        configItem,
        quantity,
        cartItem.id,
        updateItemInCart,
        fetchCartDetails,
        fetchCartId,
        removeItem,
        updateItem,
        endEditItem,
        optionSelections,
        addConfigurableProductToCart,
        addSimpleProductToCart
    ]);

    const handleValueChange = useCallback(
        value => {
            // Ensure that quantity remains an int.
            setQuantity(parseInt(value));
        },
        [setQuantity]
    );

    const isMissingOptions = isItemMissingOptions(
        cartItem,
        configItem,
        optionSelections.size
    );

    const optionsChanged = useMemo(() => {
        for (const [key, val] of initialOptionSelections) {
            const testVal = optionSelections.get(key);
            if (testVal !== val) {
                return true;
            }
        }
        return false;
    }, [initialOptionSelections, optionSelections]);

    const touched = useMemo(() => {
        return quantity !== initialQuantity || optionsChanged;
    }, [quantity, initialQuantity, optionsChanged]);

    return {
        itemName: name,
        itemPrice: amount.value,
        initialQuantity,
        handleCancel,
        handleSelectionChange,
        handleUpdate,
        handleValueChange,
        isUpdateDisabled: isMissingOptions || !touched
    };
};
