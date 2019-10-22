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
        backgroundRepeat: node.style.backgroundRepeat !== 'no-repeat'
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

const alignmentToFlex = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end'
};

/**
 * Retrieve vertical alignment from a master format node
 *
 * @param node
 * @returns {{verticalAlignment: null}}
 */
export function getVerticalAlignment(node) {
    let verticalAlignment = null;
    if (node.style.justifyContent) {
        verticalAlignment = flexToVerticalAlignment(node.style.justifyContent);
    }

    return {
        verticalAlignment
    };
}

/**
 * Convert vertical alignment values to flex values
 *
 * @param alignment
 * @returns {*}
 */
export function verticalAlignmentToFlex(alignment) {
    return alignmentToFlex[alignment];
}

/**
 * Convert flex to vertical alignment values
 *
 * @param flex
 * @returns {*}
 */
export function flexToVerticalAlignment(flex) {
    const flexToAlignment = Object.assign(
        {},
        ...Object.entries(alignmentToFlex).map(([a, b]) => ({ [b]: a }))
    );
    return flexToAlignment[flex];
}

/**
 * Retrieve advanced props from content type node
 *
 * @param node
 * @returns {{border: (string|string[]|string), marginRight: (*|string), borderColor: *, paddingBottom: (*|number|string), borderRadius: *, borderWidth: *, paddingRight: (*|number|string), marginBottom: (*|string), paddingTop: (*|string), paddingLeft: (*|string), marginTop: (*|string), marginLeft: (*|string|{get}|number)}}
 */
export function getAdvanced(node) {
    return {
        ...getPadding(node),
        ...getMargin(node),
        ...getBorder(node),
        ...getTextAlign(node),
        ...getCssClasses(node),
        ...getIsHidden(node)
    };
}

/**
 * Retrieve the padding from a content type node
 *
 * @param node
 * @returns {{paddingBottom: *, paddingRight: *, paddingTop: *, paddingLeft: *}}
 */
export function getPadding(node) {
    return {
        paddingTop: node.style.paddingTop,
        paddingRight: node.style.paddingRight,
        paddingBottom: node.style.paddingBottom,
        paddingLeft: node.style.paddingLeft
    };
}

/**
 * Retrieve the margin from a content type node
 *
 * @param node
 * @returns {{marginRight: *, marginBottom: *, marginTop: *, marginLeft: *}}
 */
export function getMargin(node) {
    return {
        marginTop: node.style.marginTop,
        marginRight: node.style.marginRight,
        marginBottom: node.style.marginBottom,
        marginLeft: node.style.marginLeft
    };
}

/**
 * Retrieve the border from a content type node
 *
 * @param node
 * @returns {{border: (string|string), borderColor: *, borderRadius: *, borderWidth: *}}
 */
export function getBorder(node) {
    return {
        border: node.style.borderStyle,
        borderColor: node.style.borderColor,
        borderWidth: node.style.borderWidth,
        borderRadius: node.style.borderRadius
    };
}

/**
 * Retrieve the text align from a content type node
 *
 * @param node
 * @returns {{textAlign: *}}
 */
export function getTextAlign(node) {
    return {
        textAlign: node.style.textAlign
    };
}

/**
 * Retrieve the CSS classes from a content type node
 * @param node
 * @returns {{cssClasses: any}}
 */
export function getCssClasses(node) {
    return {
        cssClasses: node.getAttribute('class')
            ? node.getAttribute('class').split(' ')
            : []
    };
}

/**
 * Retrieve if CSS display property is set to none from a content type node
 *
 * @param node
 * @returns {{isHidden: boolean}}
 */
export function getIsHidden(node) {
    return {
        isHidden: node.style.display === 'none'
    };
}
