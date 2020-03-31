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
        updateConfigurableOptionsMutation,
        updateQuantityMutation
    } = props;

    const [, { closeDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    const [optionSelections, setOptionSelections] = useState(new Map());
    const [formApi, setFormApi] = useState();

    const [
        updateItemQuantity,
        { called: updateQuantityCalled, loading: updateQuantityLoading }
    ] = useMutation(updateQuantityMutation);
    const [
        updateConfigurableOptions,
        { called: updateConfigurableCalled, loading: updateConfigurableLoading }
    ] = useMutation(updateConfigurableOptionsMutation);

    const isSaving =
        (updateQuantityCalled && updateQuantityLoading) ||
        (updateConfigurableCalled && updateConfigurableLoading);

    useEffect(() => {
        if (formApi) {
            formApi.setValue('quantity', cartItem.quantity);
        }
    }, [cartItem.quantity, formApi]);

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

    const handleSubmit = useCallback(
        async formValues => {
            if (optionSelections.size) {
                cartItem.configurable_options.forEach(option => {
                    if (!optionSelections.has(`${option.id}`)) {
                        optionSelections.set(`${option.id}`, option.value_id);
                    }
                });
                const productVariant = findMatchingVariant({
                    variants: configItem.variants,
                    optionCodes: configurableOptionCodes,
                    optionSelections
                });
                await updateConfigurableOptions({
                    variables: {
                        cartId,
                        cartItemId: cartItem.id,
                        parentSku: cartItem.product.sku,
                        variantSku: productVariant.product.sku,
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

            closeDrawer();
        },
        [
            cartId,
            cartItem,
            closeDrawer,
            configItem,
            configurableOptionCodes,
            optionSelections,
            updateConfigurableOptions,
            updateItemQuantity
        ]
    );

    return {
        configItem,
        handleOptionSelection,
        handleSubmit,
        isLoading: !!loading,
        isSaving,
        setFormApi
    };
};
