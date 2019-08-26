import {getAdvanced, getBackgroundImages, getCssClasses, getVerticalAlignment} from '../../utils';

export default (node) => {
    const navigationEl = node.childNodes[0];
    const navigation = {
        ...getCssClasses(navigationEl),
        ...getAdvanced(navigationEl),
    };

    const headerEls = navigationEl.childNodes;
    const headers = [].map.call(headerEls, headerEl => headerEl.innerText);

    const contentEl = node.childNodes[1];

    const itemEls = contentEl.childNodes;
    const items = [].map.call(itemEls, (itemEl) => ({
        children: [], // TODO
        style: {
            textAlign: itemEl.style.textAlign,
            display: itemEl.style.display,
            width: itemEl.style.width,
            justifyContent: itemEl.style.justifyContent,
            flexDirection: itemEl.style.flexDirection,
            alignSelf: node.style.alignSelf,
            ...getVerticalAlignment(itemEl),
            ...getBackgroundImages(itemEl),
            ...getAdvanced(itemEl)
        }
    }));

    return {
        defaultIndex: node.getAttribute('data-active-tab') ? parseInt(node.getAttribute('data-active-tab'), 10) : 0,
        headers,
        navigation,
        items,
        minHeight: node.style.minHeight ? node.style.minHeight : null,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node),
    };
};
