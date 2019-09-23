import { useMemo } from 'react';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';
const previewImageSize = 480;

export const useCategoryTile = props => {
    const { item, resourceUrl } = props;
    const { image, productImagePreview } = item;

    const imagePath = useMemo(() => {
        const previewProduct = productImagePreview.items[0];
        if (image) {
            return resourceUrl(image, {
                type: 'image-category',
                width: previewImageSize
            });
        } else if (previewProduct) {
            return resourceUrl(previewProduct.small_image, {
                type: 'image-product',
                width: previewImageSize
            });
        } else {
            return null;
        }
    }, [image, productImagePreview, resourceUrl]);

    // interpolation doesn't work inside `url()` for legacy reasons
    // so a custom property should wrap its value in `url()`
    const imageUrl = imagePath ? `url(${imagePath})` : 'none';
    const imageWrapperStyle = { '--venia-image': imageUrl };

    return {
        imagePath,
        imageWrapperStyle,
        itemName: item.name,
        itemUrl: `/${item.url_key}${categoryUrlSuffix}`
    };
};
