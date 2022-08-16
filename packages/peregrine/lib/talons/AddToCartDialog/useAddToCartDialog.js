import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useCartContext } from '../../context/cart';
import defaultOperations from './addToCartDialog.gql';
import { useEventingContext } from '../../context/eventing';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';

export const useAddToCartDialog = props => {
    const { item, onClose } = props;
    const sku = item && item.product?.sku;

    const [, { dispatch }] = useEventingContext();

    const operations = mergeOperations(defaultOperations, props.operations);

    const [userSelectedOptions, setUserSelectedOptions] = useState(new Map());
    const [currentImage, setCurrentImage] = useState();
    const [currentPrice, setCurrentPrice] = useState();
    const [currentDiscount, setCurrentDiscount] = useState();
    const [singleOptionSelection, setSingleOptionSelection] = useState();
    const [multipleOptionSelections, setMultipleOptionSelections] = useState(
        new Map()
    );

    const [{ cartId }] = useCartContext();

    const optionCodes = useMemo(() => {
        const optionCodeMap = new Map();
        if (item) {
            item.product?.configurable_options.forEach(option => {
                optionCodeMap.set(option.attribute_id, option.attribute_code);
            });
        }
        return optionCodeMap;
    }, [item]);

    // Check if display out of stock products option is selected in the Admin Dashboard
    const isOutOfStockProductDisplayed = useMemo(() => {
        if (item) {
            let totalVariants = 1;
            const { product } = item;
            const isConfigurable = isProductConfigurable(product);
            if (product?.configurable_options && isConfigurable) {
                for (const option of product.configurable_options) {
                    const length = option.values.length;
                    totalVariants = totalVariants * length;
                }
                return product.variants.length === totalVariants;
            }
        }
    }, [item]);

    const outOfStockVariants = useMemo(() => {
        if (item) {
            const product = item.product;
            return getOutOfStockVariants(
                product,
                optionCodes,
                singleOptionSelection,
                multipleOptionSelections,
                isOutOfStockProductDisplayed
            );
        }
    }, [
        item,
        optionCodes,
        singleOptionSelection,
        multipleOptionSelections,
        isOutOfStockProductDisplayed
    ]);

    const selectedOptionsArray = useMemo(() => {
        if (item) {
            const existingOptionsMap = item.configurable_options.reduce(
                (optionsMap, selectedOption) => {
                    return optionsMap.set(
                        selectedOption.id,
                        selectedOption.value_id
                    );
                },
                new Map()
            );
            const mergedOptionsMap = new Map([
                ...existingOptionsMap,
                ...userSelectedOptions
            ]);

            const selectedOptions = [];
            mergedOptionsMap.forEach((selectedValueId, attributeId) => {
                const configurableOption = item.product?.configurable_options.find(
                    option => option.attribute_id_v2 === attributeId
                );
                const configurableOptionValue = configurableOption?.values.find(
                    optionValue => optionValue.value_index === selectedValueId
                );

                selectedOptions.push(configurableOptionValue?.uid);
            });

            return selectedOptions;
        }

        return [];
    }, [item, userSelectedOptions]);

    const { data, loading: isFetchingProductDetail } = useQuery(
        operations.getProductDetailQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                configurableOptionValues: selectedOptionsArray,
                sku
            },
            skip: !sku
        }
    );

    const [
        addProductToCart,
        { error: addProductToCartError, loading: isAddingToCart }
    ] = useMutation(operations.addProductToCartMutation);

    useEffect(() => {
        if (data) {
            const product = data.products.items[0];
            const {
                media_gallery: selectedProductMediaGallery,
                variant: selectedVariant
            } = product.configurable_product_options_selection;

            const currentImage =
                selectedProductMediaGallery.length &&
                selectedOptionsArray.length
                    ? selectedProductMediaGallery[0]
                    : product.image;

            setCurrentImage(currentImage);

            const finalPrice = selectedVariant
                ? selectedVariant.price_range.maximum_price.final_price
                : product.price_range.maximum_price.final_price;

            const discount = selectedVariant
                ? selectedVariant.price_range.maximum_price.discount
                : product.price_range.maximum_price.discount;

            setCurrentDiscount(discount);
            setCurrentPrice(finalPrice);
        }
    }, [data, selectedOptionsArray.length]);

    const handleOnClose = useCallback(() => {
        onClose();
        setCurrentImage();
        setCurrentPrice();
        setUserSelectedOptions(new Map());
        setMultipleOptionSelections(new Map());
    }, [onClose]);

    const handleOptionSelection = useCallback(
        (optionId, value) => {
            setUserSelectedOptions(existing =>
                new Map(existing).set(parseInt(optionId), value)
            );
            // Create a new Map to keep track of user single selection with key as String
            const nextSingleOptionSelection = new Map();
            nextSingleOptionSelection.set(optionId, value);
            setSingleOptionSelection(nextSingleOptionSelection);
            // Create a new Map to keep track of multiple selections with key as String
            const nextMultipleOptionSelections = new Map([
                ...multipleOptionSelections
            ]);
            nextMultipleOptionSelections.set(optionId, value);
            setMultipleOptionSelections(nextMultipleOptionSelections);
        },
        [multipleOptionSelections]
    );

    const handleAddToCart = useCallback(async () => {
        try {
            const quantity = 1;

            await addProductToCart({
                variables: {
                    cartId,
                    cartItem: {
                        quantity,
                        selected_options: selectedOptionsArray,
                        sku
                    }
                }
            });

            const selectedOptionsLabels =
                selectedOptionsArray?.map((value, i) => ({
                    attribute: item.product.configurable_options[i].label,
                    value:
                        item.product.configurable_options[i].values.find(
                            x => x.uid === value
                        )?.label || null
                })) || null;

            dispatch({
                type: 'CART_ADD_ITEM',
                payload: {
                    cartId,
                    sku: item.product.sku,
                    name: item.product.name,
                    priceTotal: currentPrice.value,
                    currencyCode: currentPrice.currency,
                    discountAmount: currentDiscount.amount_off,
                    selectedOptions: selectedOptionsLabels,
                    quantity
                }
            });

            handleOnClose();
        } catch (error) {
            console.error(error);
        }
    }, [
        addProductToCart,
        cartId,
        currentDiscount,
        currentPrice,
        dispatch,
        handleOnClose,
        item,
        selectedOptionsArray,
        sku
    ]);

    const imageProps = useMemo(() => {
        if (currentImage) {
            return {
                alt: currentImage.label,
                src: currentImage.url,
                width: 400
            };
        }
    }, [currentImage]);

    const priceProps = useMemo(() => {
        if (currentPrice) {
            return {
                currencyCode: currentPrice.currency,
                value: currentPrice.value
            };
        }
    }, [currentPrice]);

    const configurableOptionProps = useMemo(() => {
        if (item) {
            return {
                onSelectionChange: handleOptionSelection,
                options: item.product?.configurable_options,
                selectedValues: item.configurable_options
            };
        }
    }, [handleOptionSelection, item]);

    const buttonProps = useMemo(() => {
        if (item) {
            return {
                disabled:
                    item.product?.configurable_options.length !==
                        selectedOptionsArray.length || isAddingToCart,
                onClick: handleAddToCart,
                priority: 'high'
            };
        }
    }, [handleAddToCart, isAddingToCart, item, selectedOptionsArray.length]);

    return {
        buttonProps,
        configurableOptionProps,
        formErrors: [addProductToCartError],
        handleOnClose,
        outOfStockVariants,
        imageProps,
        isFetchingProductDetail,
        priceProps
    };
};
