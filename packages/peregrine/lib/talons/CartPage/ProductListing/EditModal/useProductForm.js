import { useCallback, useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../../context/app';
import { useCartContext } from '../../../../context/cart';
import { findMatchingVariant } from '../../../../util/findMatchingProductVariant';

/**
 * This talon contains logic for a product edit form.
 * It performs effects and returns data for rendering the component inside a modal container.
 *
 * @function
 *
 * @param {Object} props
 * @param {Object} props.cartItem The cart item to configure on the form
 * @param {GraphQLAST} props.getConfigurableOptionsQuery GraphQL query to get the configurable options for a product.
 * @param {Function} props.setIsCartUpdating Function for setting the updating state for the shopping cart.
 * @param {Function} props.setVariantPrice Function for setting the variant price on a product.
 * @param {GraphQLAST} props.updateConfigurableOptionsMutation GraphQL mutation for updating the configurable options for a product.
 * @param {GraphQLAST} props.updateQuantityMutation GraphQL mutation for updating the quantity of a product in a cart.
 *
 * @return {ProductFormProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';
 */
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

    /**
     * Object type returned by the {@link useProductForm} talon.
     * It provides props data for a product form UI component inside a modal.
     *
     * @typedef {Object} ProductFormProps
     *
     * @property {Object} configItem Cart item to configure
     * @property {Array<Object>} formErrors An array of form errors resulting from a configuration or quantity value
     * @property {Function} handleOptionSelection A callback function handling an option selection event
     * @property {Function} handleSubmit A callback function for handling form submission
     * @property {boolean} isLoading True if the form is loading data. False otherwise.
     * @property {boolean} isSaving True if the form is saving data. False otherwise.
     */
    return {
        configItem,
        formErrors: [updateConfigurableError, updateQuantityError],
        handleOptionSelection,
        handleSubmit,
        isLoading: !!loading,
        isSaving
    };
};
