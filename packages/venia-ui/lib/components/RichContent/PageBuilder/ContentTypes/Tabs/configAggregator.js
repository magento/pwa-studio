import {
    getAdvanced,
    getBackgroundImages,
    getCssClasses,
    getVerticalAlignment
} from '../../utils';

export default node => {
    const navigationEl = node.childNodes[0];
    const navigation = {
        style: {
            ...getAdvanced(navigationEl)
        },
        ...getCssClasses(navigationEl)
    };

    const headerEls = navigationEl.childNodes;
    const headers = Array.from(headerEls, headerEl => headerEl.textContent);

    const contentEl = node.childNodes[1];
    const content = {
        style: {
            minHeight: contentEl.style.minHeight,
            ...getAdvanced(contentEl)
        }
    };

    return {
        defaultIndex: node.getAttribute('data-active-tab')
            ? parseInt(node.getAttribute('data-active-tab'), 10)
            : 0,
        headers,
        navigation,
        content,
        minHeight: content.style.minHeight ? content.style.minHeight : null,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node)
    };
};
