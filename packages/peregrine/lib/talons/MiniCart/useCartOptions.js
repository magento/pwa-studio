import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { appendOptionsToPayload } from '../../util/appendOptionsToPayload';
import { findMatchingProductOptionValue } from '../../util/productVariants';
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
        cartItem,
        configItem,
        createCartMutation,
        endEditItem,
        updateItemMutation,
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation
    } = props;

    const { name, price, qty } = cartItem;

    const [, { updateItemInCart }] = useCartContext();
    const [fetchCartId] = useMutation(createCartMutation);
    const [updateItem] = useMutation(updateItemMutation);

    const [addConfigurableProductToCart] = useMutation(
        addConfigurableProductToCartMutation
    );

    const [addSimpleProductToCart] = useMutation(
        addSimpleProductToCartMutation
    );

    const initialOptionSelections = useMemo(() => {
        const result = new Map();

        // This set should contain entries like: 176 => 26, not "Fashion Color" => "Lilac".
        // To transform, we have to find the matching configurable option and value on the configItem.
        if (cartItem.options) {
            cartItem.options.forEach(cartItemOption => {
                const {
                    option,
                    value: optionValue
                } = findMatchingProductOptionValue({
                    product: configItem,
                    variantOption: cartItemOption
                });

                if (option && optionValue) {
                    const key = option.attribute_id;
                    const value = optionValue.value_index;
                    result.set(key, value);
                }
            });
        }

        return result;
    }, [cartItem, configItem]);

    const [optionSelections, setOptionSelections] = useState(
        initialOptionSelections
    );

    const [quantity, setQuantity] = useState(qty);

    const handleCancel = useCallback(() => {
        endEditItem();
    }, [endEditItem]);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
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
            cartItemId: cartItem.item_id
        };

        if (isProductConfigurable(configItem)) {
            appendOptionsToPayload(payload, optionSelections);
        }

        // Use the proper mutation for the type.
        let addItemMutation;
        if (payload.productType === 'ConfigurableProduct') {
            addItemMutation = addConfigurableProductToCart;
        } else {
            addItemMutation = addSimpleProductToCart;
        }

        await updateItemInCart({
            ...payload,
            addItemMutation,
            fetchCartId,
            updateItem
        });
        endEditItem();
    }, [
        configItem,
        quantity,
        cartItem.item_id,
        updateItemInCart,
        fetchCartId,
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
        return quantity !== qty || optionsChanged;
    }, [quantity, qty, optionsChanged]);

    return {
        itemName: name,
        itemPrice: price,
        initialQuantity: qty,
        handleCancel,
        handleSelectionChange,
        handleUpdate,
        handleValueChange,
        isUpdateDisabled: isMissingOptions || !touched
    };
};
