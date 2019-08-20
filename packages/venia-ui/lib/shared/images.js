import { resourceUrl } from '@magento/venia-drivers';

// 4x5 transparent png
export const transparentPlaceholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAQAAADIpIVQAAAADklEQVR42mNkgAJGIhgAALQABsHyMOcAAAAASUVORK5CYII=';

export const DEFAULT_WIDTH_TO_HEIGHT_RATIO = 4 / 5;

export const imageWidths = {
    icon: 40,
    thumbnail: 80,
    small: 160,
    regular: 320,
    large: 640,
    xlarge: 1280,
    xxlarge: 1600,
    xxxlarge: 2560
};

const generateURL = imageURL => (width, height) =>
    `${resourceUrl(imageURL, {
        type: 'image-product',
        width: width,
        height: height
    })} ${width}w`;

export const generateSrcset = imageURL => {
    const generateSrcsetURL = generateURL(imageURL);
    return Object.values(imageWidths)
        .map(width =>
            generateSrcsetURL(width, width / DEFAULT_WIDTH_TO_HEIGHT_RATIO)
        )
        .join(',');
};
