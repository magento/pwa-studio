import {
    getBackgroundImages,
    getBorder,
    getCssClasses,
    getIsHidden,
    getMargin,
    getPadding,
    getTextAlign,
    getVerticalAlignment
} from '../../utils';

export default node => {
    console.log(node);
    const navigationEl = node.childNodes[0];
    const headerEls = navigationEl.childNodes;
    const headers = Array.from(headerEls, headerEl => headerEl.textContent);

    const contentEl = node.childNodes[1];

    const alignmentMatch = /tab-align-([a-zA-Z]*)/.exec(
        node.getAttribute('class')
    );
    const tabNavigationAlignment = alignmentMatch[1] || 'left';

    return {
        defaultIndex: node.getAttribute('data-active-tab')
            ? parseInt(node.getAttribute('data-active-tab'), 10)
            : 0,
        tabNavigationAlignment,
        headers,
        minHeight: contentEl.style.minHeight,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getMargin(node),
        ...getTextAlign(contentEl),
        ...getPadding(node),
        ...getBorder(contentEl),
        ...getIsHidden(node),
        ...getCssClasses(node)
    };
};
