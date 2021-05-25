import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useCartContext } from '../../context/cart';
import defaultOperations from './addToCartDialog.gql';

export const useAddToCartDialog = props => {
    const { item, onClose } = props;
    const sku = item && item.product.sku;

    const operations = mergeOperations(defaultOperations, props.operations);

    const [userSelectedOptions, setUserSelectedOptions] = useState(new Map());
    const [currentImage, setCurrentImage] = useState();
    const [currentPrice, setCurrentPrice] = useState();

    const [{ cartId }] = useCartContext();

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

            setCurrentPrice(finalPrice);
        }
    }, [data, selectedOptionsArray.length]);

    const handleOnClose = useCallback(() => {
        onClose();
        setCurrentImage();
        setCurrentPrice();
        setUserSelectedOptions(new Map());
    }, [onClose]);

    const handleOptionSelection = useCallback((optionId, value) => {
        setUserSelectedOptions(existing =>
            new Map(existing).set(parseInt(optionId), value)
        );
    }, []);

    const handleAddToCart = useCallback(async () => {
        try {
            await addProductToCart({
                variables: {
                    cartId,
                    cartItem: {
                        quantity: 1,
                        selected_options: selectedOptionsArray,
                        sku
                    }
                }
            });

            handleOnClose();
        } catch (error) {
            console.error(error);
        }
    }, [addProductToCart, cartId, handleOnClose, selectedOptionsArray, sku]);

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
        imageProps,
        isFetchingProductDetail,
        priceProps
    };
};
