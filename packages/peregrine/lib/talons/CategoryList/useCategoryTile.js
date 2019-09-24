import { useMemo } from 'react';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';
const previewImageSize = 480;

/**
 *
 * @returns {Object} retVal - an object containing image and item props.
 * @returns {Object} retVal.image - an object containing url, type and width for the category image
 * @returns {Object} retVal.item - an object containing name and url for the category tile
 */
export const useCategoryTile = props => {
    const { item } = props;
    const { image, productImagePreview } = item;

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
            return null;
        }
    }, [image, productImagePreview]);

    const itemObject = useMemo(
        () => ({
            name: item.name,
            url: `/${item.url_key}${categoryUrlSuffix}`
        }),
        [item]
    );

    return {
        image: imageObj,
        item: itemObject
    };
};
