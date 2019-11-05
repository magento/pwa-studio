import { resourceUrl } from '@magento/venia-drivers';

/**
 * This is specific to the Venia store-front sample data.
 */
export const DEFAULT_WIDTH_TO_HEIGHT_RATIO = 4 / 5;

export const imageWidths = {
    ICON: 40,
    THUMBNAIL: 80,
    SMALL: 160,
    REGULAR: 320,
    LARGE: 640,
    LARGER: 960,
    XLARGE: 1280,
    XXLARGE: 1600,
    XXXLARGE: 2560
};

const generateURL = (imageURL, mediaBase) => (width, height) => {
    const url = resourceUrl(imageURL, {
        type: mediaBase,
        width,
        height
    });

    return `${url} ${width}w`;
};

export const generateSrcset = (imageURL, mediaBase) => {
    if (!imageURL || !mediaBase) return '';

    const generateSrcsetURL = generateURL(imageURL, mediaBase);
    return Object.values(imageWidths)
        .map(width =>
            generateSrcsetURL(width, width / DEFAULT_WIDTH_TO_HEIGHT_RATIO)
        )
        .join(',\n');
};
