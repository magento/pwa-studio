import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment
} from '../../utils';

export default node => {
    const navigationEl = node.childNodes[0];
    const headerEls = navigationEl.childNodes;
    const headers = Array.from(headerEls, headerEl => headerEl.textContent);

    const contentEl = node.childNodes[1];

    return {
        defaultIndex: node.getAttribute('data-active-tab')
            ? parseInt(node.getAttribute('data-active-tab'), 10)
            : 0,
        headers,
        minHeight: contentEl.style.minHeight,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node)
    };
};
