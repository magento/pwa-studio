/**
 * Retrieve background images from a master format node
 *
 * @param node
 * @returns {{mobileImage: null, desktopImage: null}}
 */
export function getBackgroundImages(node) {
    const images = node.getAttribute('data-background-images');
    const response = {
        desktopImage: null,
        mobileImage: null
    };

    if (images) {
        const imagesStructure = JSON.parse(images.replace(/\\"/g, '"'));
        if (imagesStructure.desktop_image) {
            response.desktopImage = imagesStructure.desktop_image;
        }
        if (imagesStructure.mobile_image) {
            response.mobileImage = imagesStructure.mobile_image;
        }
    }

    return response;
}

/**
 * Retrieve vertical alignment from a master format node
 *
 * @param node
 * @returns {{verticalAlignment: null}}
 */
export function getVerticalAlignment(node) {
    let alignment = null;
    if (node.style.justifyContent) {
        switch (node.style.justifyContent) {
            case 'flex-start':
                alignment = 'top';
                break;
            case 'center':
                alignment = 'middle';
                break;
            case 'flex-end':
                alignment = 'bottom';
                break;
        }
    }

    return {
        verticalAlignment: alignment
    };
}
