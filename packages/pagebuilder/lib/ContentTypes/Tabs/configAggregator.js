import {
    getBorder,
    getCssClasses,
    getIsHidden,
    getMargin,
    getPadding,
    getTextAlign,
    getVerticalAlignment,
    getMediaQueries
} from '../../utils';

export default node => {
    const navigationEl = node.childNodes[0];
    const headerEls = navigationEl.childNodes;
    const headers = Array.from(headerEls, headerEl => headerEl.textContent);

    const contentEl = node.childNodes[1];

    const alignmentMatch = /tab-align-([a-zA-Z]*)/.exec(
        node.getAttribute('class')
    );
    const tabNavigationAlignment = alignmentMatch ? alignmentMatch[1] : null;

    return {
        defaultIndex: node.getAttribute('data-active-tab')
            ? parseInt(node.getAttribute('data-active-tab'), 10)
            : 0,
        minHeight: contentEl.style.minHeight,
        tabNavigationAlignment: tabNavigationAlignment || 'left',
        headers,
        ...getVerticalAlignment(node),
        ...getMargin(node),
        ...getTextAlign(contentEl),
        ...getPadding(node),
        ...getBorder(contentEl),
        ...getIsHidden(node),
        ...getCssClasses(node),
        ...getMediaQueries(contentEl)
    };
};
