import { useCallback, useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../../context/app';
import { useCartContext } from '../../../../context/cart';
import { findMatchingVariant } from '../../../../util/findMatchingProductVariant';

export const useProductForm = props => {
    const {
        cartItem,
        getConfigurableOptionsQuery,
        setIsCartUpdating,
        setVariantPrice,
        updateConfigurableOptionsMutation,
        updateQuantityMutation
    } = props;

    const [, { closeDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    const [optionSelections, setOptionSelections] = useState(new Map());

    const [
        updateItemQuantity,
        {
            called: updateQuantityCalled,
            error: updateQuantityError,
            loading: updateQuantityLoading
        }
    ] = useMutation(updateQuantityMutation);
    const [
        updateConfigurableOptions,
        {
            called: updateConfigurableCalled,
            error: updateConfigurableError,
            loading: updateConfigurableLoading
        }
    ] = useMutation(updateConfigurableOptionsMutation);

    const isSaving =
        (updateQuantityCalled && updateQuantityLoading) ||
        (updateConfigurableCalled && updateConfigurableLoading);

    useEffect(() => {
        setIsCartUpdating(isSaving);
    }, [isSaving, setIsCartUpdating]);

    const { data, error, loading } = useQuery(getConfigurableOptionsQuery, {
        variables: {
            sku: cartItem.product.sku
        }
    });

    const handleOptionSelection = useCallback(
        (optionId, selection) => {
            const nextOptionSelections = new Map([...optionSelections]);
            const initialSelection = cartItem.configurable_options.find(
                option => option.id == optionId
            );

            if (initialSelection.value_id === selection) {
                nextOptionSelections.delete(optionId);
            } else {
                nextOptionSelections.set(optionId, selection);
            }

            setOptionSelections(nextOptionSelections);
        },
        [cartItem.configurable_options, optionSelections]
    );

    const configItem = !loading && !error ? data.products.items[0] : null;
    const configurableOptionCodes = useMemo(() => {
        const optionCodeMap = new Map();
        if (configItem) {
            configItem.configurable_options.forEach(option => {
                optionCodeMap.set(option.attribute_id, option.attribute_code);
            });
        }

        return optionCodeMap;
    }, [configItem]);

    const selectedVariant = useMemo(() => {
        if (optionSelections.size && configItem) {
            cartItem.configurable_options.forEach(option => {
                if (!optionSelections.has(`${option.id}`)) {
                    optionSelections.set(`${option.id}`, option.value_id);
                }
            });
            return findMatchingVariant({
                variants: configItem.variants,
                optionCodes: configurableOptionCodes,
                optionSelections
            });
        }
    }, [
        cartItem.configurable_options,
        configItem,
        configurableOptionCodes,
        optionSelections
    ]);

    useEffect(() => {
        let variantPrice = null;

        if (selectedVariant) {
            const { product } = selectedVariant;
            const { price } = product;
            const { regularPrice } = price;
            variantPrice = regularPrice.amount;
        }

        setVariantPrice(variantPrice);
    }, [selectedVariant, setVariantPrice]);

    const handleSubmit = useCallback(
        async formValues => {
            try {
                if (selectedVariant) {
                    await updateConfigurableOptions({
                        variables: {
                            cartId,
                            cartItemId: cartItem.id,
                            parentSku: cartItem.product.sku,
                            variantSku: selectedVariant.product.sku,
                            quantity: formValues.quantity
                        }
                    });
                } else if (formValues.quantity !== cartItem.quantity) {
                    await updateItemQuantity({
                        variables: {
                            cartId,
                            cartItemId: cartItem.id,
                            quantity: formValues.quantity
                        }
                    });
                }
            } catch {
                return;
            }

            closeDrawer();
        },
        [
            cartId,
            cartItem.id,
            cartItem.product.sku,
            cartItem.quantity,
            closeDrawer,
            selectedVariant,
            updateConfigurableOptions,
            updateItemQuantity
        ]
    );

    return {
        configItem,
        formErrors: [updateConfigurableError, updateQuantityError],
        handleOptionSelection,
        handleSubmit,
        isLoading: !!loading,
        isSaving
    };
};
