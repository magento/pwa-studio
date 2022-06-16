import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useIntl } from 'react-intl';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '../query/orderIncidence.gql';

export const useOrderIncidence = props => {
    const { orderItems, incidence, incidencesImages, setIncidencesImages } = props;

    const [imagesValues, setImagesValues] = useState([]);

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const urlKeys = useMemo(() => {
        if (orderItems) {
            return orderItems.map(item => item.product_url_key).sort();
        }
        return '';
    }, [orderItems]);

    const { getProductThumbnailsQuery, getConfigurableThumbnailSource } = operations;

    const { formatMessage } = useIntl();
    const [productSelected, setProductSelected] = useState(0);

    useEffect(() => {
        if (imagesValues.length !== 0) {
            setIncidencesImages(prev => ({
                ...prev,
                ['images' + incidence.id]: {
                    values: imagesValues
                }
            }));
        }
    }, [imagesValues]);

    const { data, loading } = useQuery(getProductThumbnailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKeys
        }
    });

    const { data: configurableThumbnailSourceData } = useQuery(getConfigurableThumbnailSource, {
        fetchPolicy: 'cache-and-network'
    });

    const configurableThumbnailSource = useMemo(() => {
        if (configurableThumbnailSourceData) {
            return configurableThumbnailSourceData.storeConfig.configurable_thumbnail_source;
        }
    }, [configurableThumbnailSourceData]);

    const imagesData = useMemo(() => {
        if (data && orderItems) {
            // Images data is taken from simple product or from configured variant and assigned to item sku
            const mappedImagesData = {};
            orderItems.forEach(item => {
                const product = data.products.items.find(element => item.product_url_key === element.url_key);
                if (configurableThumbnailSource === 'itself' && product.variants && product.variants.length > 0) {
                    const foundVariant = product.variants.find(variant => {
                        return variant.product.sku === item.product_sku;
                    });
                    mappedImagesData[item.product_sku] = foundVariant.product;
                } else {
                    mappedImagesData[item.product_sku] = product;
                }
            });

            return mappedImagesData;
        } else {
            return {};
        }
    }, [data, orderItems, configurableThumbnailSource]);

    function handleProductSelected(event) {
        setProductSelected(event.currentTarget.selectedIndex);
    }

    return {
        loading,
        productSelected,
        imagesData,
        handleProductSelected,
        setImagesValues
    };
};
