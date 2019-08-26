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
        mobileImage: null,
        backgroundSize: node.style.backgroundSize,
        backgroundPosition: node.style.backgroundPosition,
        backgroundAttachment: node.style.backgroundAttachment,
        backgroundRepeat: node.style.backgroundRepeat !== "no-repeat",
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

/**
 * Retrieve advanced props from content type node
 *
 * @param node
 * @returns {{border: (string|string[]|string), marginRight: (*|string), borderColor: *, paddingBottom: (*|number|string), borderRadius: *, borderWidth: *, paddingRight: (*|number|string), marginBottom: (*|string), paddingTop: (*|string), paddingLeft: (*|string), marginTop: (*|string), marginLeft: (*|string|{get}|number)}}
 */
export function getAdvanced(node) {
    return {
        border: node.style.borderStyle,
        borderColor: node.style.borderColor,
        borderWidth: node.style.borderWidth,
        borderRadius: node.style.borderRadius,
        marginTop: node.style.marginTop,
        marginRight: node.style.marginRight,
        marginBottom: node.style.marginBottom,
        marginLeft: node.style.marginLeft,
        paddingTop: node.style.paddingTop,
        paddingRight: node.style.paddingRight,
        paddingBottom: node.style.paddingBottom,
        paddingLeft: node.style.paddingLeft,
    }
}
