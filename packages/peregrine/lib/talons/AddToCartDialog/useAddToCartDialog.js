import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useCartContext } from '../../context/cart';
import defaultOperations from './addToCartDialog.gql';
import { useEventingContext } from '../../context/eventing';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { findAllMatchingVariants } from '@magento/peregrine/lib/util/findAllMatchingVariants';
import { getOutOfStockIndexes } from '@magento/peregrine/lib/util/getOutOfStockIndexes';
import { createProductVariants } from '@magento/peregrine/lib/util/createProductVariants';

const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';

const getOutOfStockVariants = (
    product,
    optionCodes,
    singleOptionSelection,
    multipleOptionSelections,
    isOutOfStockProductDisplayed
) => {
    const isConfigurable = product && isProductConfigurable(product);
    const singeOptionSelected =
        singleOptionSelection && singleOptionSelection.size === 1;
    const optionsSelected =
        Array.from(multipleOptionSelections.values()).filter(value => !!value)
            .length > 1;
    const outOfStockIndexes = [];

    // Find the combination of k elements in the array.
    // For example: array is [1,2,3]. k=2.
    // The results are [[1,2],[1,3],[2,3]]
    function getCombinations(array, k, prefix = []) {
        if (k == 0) return [prefix];
        return array.flatMap((value, index) =>
            getCombinations(array.slice(index + 1), k - 1, [...prefix, value])
        );
    }

    if (isConfigurable) {
        let variants = product.variants;
        let variantsIfOutOfStockProductsNotDisplayed = createProductVariants(
            product
        );
        //If out of stock products is set to not displayed, use the variants created
        variants = isOutOfStockProductDisplayed
            ? variants
            : variantsIfOutOfStockProductsNotDisplayed;

        const numberOfVariations = variants[0].attributes.length;
        const selectedIndexes = Array.from(
            multipleOptionSelections.values()
        ).flat();

        // If only one pair of variations, display out of stock variations before option selection
        if (numberOfVariations === 1) {
            let outOfStockOptions = variants.filter(
                variant => variant.product.stock_status === OUT_OF_STOCK_CODE
            );

            let outOfStockIndex = outOfStockOptions.map(option =>
                option.attributes.map(attribute => attribute.value_index)
            );
            return outOfStockIndex;
        } else {
            if (singeOptionSelected) {
                const items = findAllMatchingVariants({
                    optionCodes,
                    singleOptionSelection,
                    variants
                });
                const outOfStockItemsIndexes = getOutOfStockIndexes(items);

                // For all the out of stock options associated with current selection, display out of stock swatches
                // when the number of matching indexes of selected indexes and out of stock indexes are not smaller than the total groups of swatches minus 1
                for (const indexes of outOfStockItemsIndexes) {
                    const sameIndexes = indexes.filter(num =>
                        selectedIndexes.includes(num)
                    );
                    const differentIndexes = indexes.filter(
                        num => !selectedIndexes.includes(num)
                    );
                    if (sameIndexes.length >= optionCodes.size - 1) {
                        outOfStockIndexes.push(differentIndexes);
                    }
                }
                // Display all possible out of stock swatches with current selections, when all groups of swatches are selected
                if (
                    optionsSelected &&
                    selectedIndexes.length === optionCodes.size
                ) {
                    const selectedIndexesCombinations = getCombinations(
                        selectedIndexes,
                        selectedIndexes.length - 1
                    );
                    // Find out of stock items and indexes for each combination
                    let oosIndexes = [];
                    for (const option of selectedIndexesCombinations) {
                        // Map the option indexes to their optionCodes
                        const curOption = new Map(
                            [...multipleOptionSelections].filter(([key, val]) =>
                                option.includes(val)
                            )
                        );
                        const curItems = findAllMatchingVariants({
                            optionCodes: optionCodes,
                            singleOptionSelection: curOption,
                            variants: variants
                        });
                        const outOfStockIndex = getOutOfStockIndexes(curItems)
                            .flat()
                            .filter(idx => !selectedIndexes.includes(idx));
                        oosIndexes.push(outOfStockIndex);
                    }
                    return oosIndexes;
                }
                return outOfStockIndexes;
            }
        }
    }
    return [];
};

export const useAddToCartDialog = props => {
    const { item, onClose } = props;
    const sku = item && item.product.sku;

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
            item.product.configurable_options.forEach(option => {
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
            if (product.configurable_options && isConfigurable) {
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
                const configurableOption = item.product.configurable_options.find(
                    option => option.attribute_id_v2 === attributeId
                );
                const configurableOptionValue = configurableOption.values.find(
                    optionValue => optionValue.value_index === selectedValueId
                );

                selectedOptions.push(configurableOptionValue.uid);
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
        [singleOptionSelection, multipleOptionSelections]
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
                options: item.product.configurable_options,
                selectedValues: item.configurable_options
            };
        }
    }, [handleOptionSelection, item]);

    const buttonProps = useMemo(() => {
        if (item) {
            return {
                disabled:
                    item.product.configurable_options.length !==
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
