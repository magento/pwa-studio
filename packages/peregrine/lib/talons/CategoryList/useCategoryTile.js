import { useCallback, useMemo } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const previewImageSize = 480;

/**
 * Returns props necessary to render a CategoryTile component.
 *
 * @returns {Object} props necessary to render a category tile
 * @returns {Object} .image - an object containing url, type and width for the category image
 * @returns {Object} .item - an object containing name and url for the category tile
 * @returns {Function} .handleClick - callback to fire on link click
 */
export const useCategoryTile = props => {
    const { item } = props;
    const { image, productImagePreview } = item;
    const [
        ,
        {
            actions: { setNextRootComponent }
        }
    ] = useAppContext();

    const imageObj = useMemo(() => {
        const previewProduct = productImagePreview.items[0];
        if (image) {
            return {
                url: image,
                type: 'image-category',
                width: previewImageSize
            };
        } else if (previewProduct) {
            return {
                url: previewProduct.small_image,
                type: 'image-product',
                width: previewImageSize
            };
        } else {
            return {
                url: '',
                type: 'image-category',
                width: previewImageSize
            };
        }
    }, [image, productImagePreview]);

    const itemObject = useMemo(
        () => ({
            name: item.name,
            url: `/${item.url_key}${item.url_suffix || ''}`
        }),
        [item]
    );

    const handleClick = useCallback(() => {
        // Sets next root component to show proper loading effect
        setNextRootComponent('category');
    }, [setNextRootComponent]);

    return {
        image: imageObj,
        item: itemObject,
        handleClick
    };
};
