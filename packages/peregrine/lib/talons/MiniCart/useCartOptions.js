import { useCallback, useMemo, useState } from 'react';
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
    const { cartItem, configItem, endEditItem, updateCart } = props;

    const { name, price, qty } = cartItem;

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

    const handleUpdate = useCallback(() => {
        const payload = {
            item: configItem,
            productType: configItem.__typename,
            quantity: quantity
        };

        if (isProductConfigurable(configItem)) {
            appendOptionsToPayload(payload, optionSelections);
        }

        updateCart(payload, cartItem.item_id);
    }, [cartItem, configItem, quantity, optionSelections, updateCart]);

    const handleValueChange = useCallback(
        value => {
            setQuantity(value);
        },
        [setQuantity]
    );

    const isMissingOptions = isItemMissingOptions(
        cartItem,
        configItem,
        optionSelections.size
    );

    return {
        itemName: name,
        itemPrice: price,
        itemQuantity: qty,
        handleCancel,
        handleSelectionChange,
        handleUpdate,
        handleValueChange,
        isUpdateDisabled: isMissingOptions
    };
};
