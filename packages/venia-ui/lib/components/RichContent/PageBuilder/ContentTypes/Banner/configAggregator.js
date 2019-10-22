import {
    getMargin,
    getBackgroundImages,
    getBorder,
    getPadding,
    getTextAlign,
    getCssClasses,
    getIsHidden
} from '../../utils';

/**
 * Determine the button type based on class
 *
 * @param node
 * @returns {string}
 */
const getButtonType = node => {
    if (node.classList.contains('pagebuilder-button-secondary')) {
        return 'secondary';
    }
    if (node.classList.contains('pagebuilder-button-link')) {
        return 'link';
    }
    return 'primary';
};

export default (node, props) => {
    const wrapperElement = node.querySelector('[data-element="wrapper"]');
    const overlayElement = node.querySelector('[data-element="overlay"]');
    const linkElement = node.querySelector('a[data-element="link"]');
    const buttonElement = node.querySelector('[data-element="button"]');
    const showButton = node.getAttribute('data-show-button');
    const showOverlay = node.getAttribute('data-show-overlay');

    let minHeightPaddingElement = wrapperElement;
    if (props.appearance === 'poster') {
        minHeightPaddingElement = overlayElement;
    }

    return {
        minHeight: minHeightPaddingElement.style.minHeight || null,
        backgroundColor: wrapperElement.style.backgroundColor,
        ...getBackgroundImages(wrapperElement),
        content: node.querySelector('[data-element="content"]').innerHTML,
        link: linkElement ? linkElement.getAttribute('href') : null,
        linkType: linkElement
            ? linkElement.getAttribute('data-link-type')
            : null,
        openInNewTab:
            linkElement && linkElement.getAttribute('target') === '_blank',
        showButton,
        buttonText:
            buttonElement && showButton !== 'never'
                ? buttonElement.textContent
                : null,
        buttonType:
            buttonElement && showButton !== 'never'
                ? getButtonType(buttonElement)
                : null,
        showOverlay,
        overlayColor:
            overlayElement && showOverlay !== 'never'
                ? overlayElement.getAttribute('data-overlay-color')
                : null,
        ...getTextAlign(wrapperElement),
        ...getBorder(wrapperElement),
        ...getCssClasses(node),
        ...getMargin(node),
        ...getPadding(minHeightPaddingElement),
        ...getIsHidden(node)
    };
};
