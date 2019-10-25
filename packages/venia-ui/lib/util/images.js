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
    XLARGE: 1280,
    XXLARGE: 1600,
    XXXLARGE: 2560
};

const generateURL = (imageURL, type) => (width, height) =>
    resourceUrl(imageURL, {
        type,
        width,
        height
    });

export const generateURLFromContainerWidth = (
    imageURL,
    type = 'image-product',
    containerWidth
) => {
    const intrinsicWidth = window.devicePixelRatio * containerWidth;
    const actualWidth = Object.values(imageWidths).reduce((prev, curr) => {
        if (prev) {
            return Math.abs(intrinsicWidth - curr) <
                Math.abs(intrinsicWidth - prev)
                ? curr
                : prev;
        } else {
            return curr;
        }
    }, null);

    return generateURL(imageURL, type)(
        actualWidth,
        actualWidth / DEFAULT_WIDTH_TO_HEIGHT_RATIO
    );
};

export const generateSrcset = (imageURL, type) => {
    if (!imageURL || !type) return '';

    const generateSrcsetURL = generateURL(imageURL, type);

    return Object.values(imageWidths)
        .map(
            width =>
                `${generateSrcsetURL(
                    width,
                    width / DEFAULT_WIDTH_TO_HEIGHT_RATIO
                )} ${width}w`
        )
        .join(',\n');
};
