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
    const headers = [].map.call(headerEls, headerEl => headerEl.innerText);

    const contentEl = node.childNodes[1];
    const content = {
        style: {
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
        minHeight: node.style.minHeight ? node.style.minHeight : null,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node)
    };
};
