import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import defaultOperations from './addToCartDialog.gql';

export const useAddToCartDialog = props => {
    const { item } = props;
    const sku = item && item.product.sku;

    const [userSelectedOptions, setUserSelectedOptions] = useState(new Map());
    const [currentImage, setCurrentImage] = useState();

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

    const { data } = useQuery(defaultOperations.getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            configurableOptionValues: selectedOptionsArray,
            sku
        },
        skip: !sku
    });

    useEffect(() => {
        if (data) {
            const product = data.products.items[0];

            const currentImage = selectedOptionsArray.length
                ? product.configurable_product_options_selection
                      .media_gallery[0]
                : product.image;

            setCurrentImage(currentImage);
        }
    }, [data, selectedOptionsArray.length]);

    const handleOptionSelection = useCallback((optionId, value) => {
        setUserSelectedOptions(existing =>
            new Map(existing).set(parseInt(optionId), value)
        );
    }, []);

    const imageProps = useMemo(() => {
        if (currentImage) {
            return {
                alt: currentImage.label,
                displayPlaceholder: true,
                resource: currentImage.url,
                width: 400
            };
        }
    }, [currentImage]);

    const priceProps = useMemo(() => {
        if (item) {
            const finalPrice =
                item.product.price_range.maximum_price.final_price;
            return {
                currencyCode: finalPrice.currency,
                value: finalPrice.value
            };
        }
    }, [item]);

    const configurableOptionProps = useMemo(() => {
        if (item) {
            return {
                onSelectionChange: handleOptionSelection,
                options: item.product.configurable_options,
                selectedValues: item.configurable_options
            };
        }
    }, [handleOptionSelection, item]);

    return {
        configurableOptionProps,
        imageProps,
        priceProps
    };
};
