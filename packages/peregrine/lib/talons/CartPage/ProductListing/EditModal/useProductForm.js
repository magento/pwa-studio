import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '../../../../context/cart';
import { findMatchingVariant } from '../../../../util/findMatchingProductVariant';
import DEFAULT_OPERATIONS from './productForm.gql';
import { useEventingContext } from '../../../../context/eventing';
import { getOutOfStockVariantsWithInitialSelection } from '../../../../util/getOutOfStockVariantsWithInitialSelection';

/**
 * This talon contains logic for a product edit form.
 * It performs effects and returns data for rendering the component inside a modal container.
 *
 * This talon performs the following effects:
 *
 * - Manage the updating state of the cart while form data is being saved
 * - Set the variant price on a product depending on the product's options
 *
 * @function
 *
 * @param {Object} props
 * @param {Object} props.cartItem The cart item to configure on the form
 * @param {GraphQLDocument} props.getConfigurableOptionsQuery GraphQL query to get the configurable options for a product.
 * @param {function} props.setIsCartUpdating Function for setting the updating state for the shopping cart.
 * @param {function} props.setVariantPrice Function for setting the variant price on a product.
 * @param {GraphQLDocument} props.updateConfigurableOptionsMutation GraphQL mutation for updating the configurable options for a product.
 * @param {GraphQLDocument} props.updateQuantityMutation GraphQL mutation for updating the quantity of a product in a cart.
 * @param {function} props.setActiveEditItem Function for setting the actively editing item.
 *
 * @return {ProductFormTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';
 */

// Get initial selections
function deriveOptionSelectionsFromProduct(cartItem) {
    if (cartItem) {
        const initialOptionSelections = new Map();
        for (const { id, value_id } of cartItem.configurable_options) {
            initialOptionSelections.set(String(id), value_id);
        }
        return initialOptionSelections;
    }
}

export const useProductForm = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getConfigurableThumbnailSourceQuery,
        getConfigurableOptionsQuery,
        updateConfigurableOptionsMutation,
        updateQuantityMutation
    } = operations;

    const {
        cartItem,
        setIsCartUpdating,
        setVariantPrice,
        setActiveEditItem
    } = props;

    const [, { dispatch }] = useEventingContext();

    const [{ cartId }] = useCartContext();

    const derivedOptionSelections = useMemo(() => {
        if (cartItem) {
            return deriveOptionSelectionsFromProduct(cartItem);
        }
    }, [cartItem]);

    const [optionSelections, setOptionSelections] = useState(new Map());
    const [multipleOptionSelections, setMultipleOptionSelections] = useState(
        derivedOptionSelections ? derivedOptionSelections : new Map()
    );
    useEffect(() => {
        if (cartItem) {
            setMultipleOptionSelections(derivedOptionSelections);
        }
    }, [derivedOptionSelections, cartItem]);

    const handleClose = useCallback(() => {
        setMultipleOptionSelections(new Map());
        setOptionSelections(new Map());
        setActiveEditItem(null);
    }, [setActiveEditItem, setMultipleOptionSelections, setOptionSelections]);

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
        skip: !cartItem,
        variables: {
            sku: cartItem ? cartItem.product.sku : null
        }
    });

    const { data: storeConfigData } = useQuery(
        getConfigurableThumbnailSourceQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const handleOptionSelection = useCallback(
        (optionId, selection) => {
            const nextOptionSelections = new Map([...optionSelections]);

            const initialSelection = cartItem.configurable_options.find(
                option => option.id == optionId
            );

            if (initialSelection?.value_id === selection) {
                nextOptionSelections.delete(optionId);
            } else {
                nextOptionSelections.set(optionId, selection);
            }

            setOptionSelections(nextOptionSelections);

            // Create a new Map to only keep track of user multiple selections with key as String
            // without considering initialSelection.value_id
            const nextMultipleOptionSelections = new Map([
                ...multipleOptionSelections
            ]);
            nextMultipleOptionSelections.set(optionId, selection);
            setMultipleOptionSelections(nextMultipleOptionSelections);
        },
        [cartItem, optionSelections, multipleOptionSelections]
    );

    const configItem =
        !loading && !error && data ? data.products.items[0] : null;

    // Check if display out of stock products option is selected in the Admin Dashboard
    const isOutOfStockProductDisplayed = useMemo(() => {
        let totalVariants = 1;

        if (configItem && configItem.configurable_options) {
            for (const option of configItem.configurable_options) {
                const length = option.values.length;
                totalVariants = totalVariants * length;
            }
            return configItem.variants.length === totalVariants;
        }
    }, [configItem]);

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
            const mergedOptionSelections = new Map([...optionSelections]);
            cartItem.configurable_options.forEach(option => {
                if (!mergedOptionSelections.has(`${option.id}`)) {
                    mergedOptionSelections.set(`${option.id}`, option.value_id);
                }
            });

            return findMatchingVariant({
                variants: configItem.variants,
                optionCodes: configurableOptionCodes,
                optionSelections: mergedOptionSelections
            });
        }
    }, [cartItem, configItem, configurableOptionCodes, optionSelections]);

    const outOfStockVariants = useMemo(() => {
        if (cartItem && configItem) {
            const product = cartItem.product;
            return getOutOfStockVariantsWithInitialSelection(
                product,
                configurableOptionCodes,
                multipleOptionSelections,
                configItem,
                isOutOfStockProductDisplayed
            );
        }
    }, [
        cartItem,
        configurableOptionCodes,
        multipleOptionSelections,
        configItem,
        isOutOfStockProductDisplayed
    ]);

    const configurableThumbnailSource = useMemo(() => {
        return storeConfigData?.storeConfig?.configurable_thumbnail_source;
    }, [storeConfigData]);

    useEffect(() => {
        const variantPrice =
            selectedVariant?.product?.price_range?.maximum_price?.final_price;
        setVariantPrice(variantPrice);
    }, [selectedVariant, setVariantPrice]);

    const handleSubmit = useCallback(
        async formValues => {
            try {
                const quantity = formValues.quantity;

                if (
                    (selectedVariant && optionSelections.size) ||
                    (selectedVariant && multipleOptionSelections.size)
                ) {
                    await updateConfigurableOptions({
                        variables: {
                            cartId,
                            cartItemId: cartItem.uid,
                            parentSku: cartItem.product.sku,
                            variantSku: selectedVariant.product.sku,
                            quantity: quantity
                        }
                    });

                    setOptionSelections(new Map());
                    setMultipleOptionSelections(new Map());
                } else if (quantity !== cartItem.quantity) {
                    await updateItemQuantity({
                        variables: {
                            cartId,
                            cartItemId: cartItem.uid,
                            quantity: quantity
                        }
                    });
                }

                const selectedOptionsLabels =
                    // with updated variant
                    selectedVariant?.attributes?.map(({ value_index }, i) => {
                        const current = configItem.configurable_options[i];
                        const attribute = current.label;
                        const value = current.values.find(
                            x => x.value_index === value_index
                        )?.label;

                        return { attribute, value };
                    }) ||
                    // with current variant (updating only quantity)
                    cartItem.configurable_options.map(
                        ({ option_label, value_label }) => ({
                            attribute: option_label,
                            value: value_label
                        })
                    ) ||
                    // not applicable
                    null;

                dispatch({
                    type: 'CART_UPDATE_ITEM',
                    payload: {
                        cartId,
                        sku: cartItem.product.sku,
                        name: cartItem.product.name,
                        priceTotal: cartItem.prices.price.value,
                        currencyCode: cartItem.prices.price.currency,
                        discountAmount:
                            cartItem.prices.total_item_discount.value,
                        selectedOptions: selectedOptionsLabels,
                        quantity
                    }
                });
            } catch {
                return;
            }

            handleClose();
        },
        [
            cartId,
            cartItem,
            configItem,
            dispatch,
            handleClose,
            optionSelections.size,
            multipleOptionSelections.size,
            selectedVariant,
            updateConfigurableOptions,
            updateItemQuantity
        ]
    );

    const errors = useMemo(
        () =>
            new Map([
                ['updateQuantityMutation', updateQuantityError],
                ['updateConfigurableOptionsMutation', updateConfigurableError]
            ]),
        [updateConfigurableError, updateQuantityError]
    );

    return {
        configItem,
        errors,
        handleOptionSelection,
        handleSubmit,
        outOfStockVariants,
        isLoading: !!loading,
        isSaving,
        isDialogOpen: cartItem !== null,
        handleClose,
        configurableThumbnailSource
    };
};

/** JSDocs type definitions */

/**
 * Object type returned by the {@link useProductForm} talon.
 * It provides props data for a product form UI component inside a modal.
 *
 * @typedef {Object} ProductFormTalonProps
 *
 * @property {Object} configItem Cart item to configure
 * @property {Array<Error>} errors An array of form errors resulting from a configuration or quantity value
 * @property {function} handleOptionSelection A callback function handling an option selection event
 * @property {function} handleSubmit A callback function for handling form submission
 * @property {boolean} isLoading True if the form is loading data. False otherwise.
 * @property {boolean} isSaving True if the form is saving data. False otherwise.
 * @property {boolean} isDialogOpen True if the form is visible. False otherwise.
 * @property {function} handleClose A callback function for handling form closing
 * @property {String} configurableThumbnailSource A string indicating which thumbnail should be used for configurable products
 */
