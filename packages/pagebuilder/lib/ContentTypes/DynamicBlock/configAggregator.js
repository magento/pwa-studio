import { getAdvanced } from '../../utils';

export default node => {
    const widgetBlock = node.childNodes[0];

    if (
        !widgetBlock ||
        (widgetBlock && !widgetBlock.getAttribute('data-uids'))
    ) {
        return {};
    }

    return {
        minHeight: widgetBlock.style.minHeight || null,
        displayInline: widgetBlock
            .getAttribute('class')
            .includes('block-banners-inline'),
        displayMode: widgetBlock.getAttribute('data-display-mode'),
        uids: widgetBlock.getAttribute('data-uids'),
        ...getAdvanced(node)
    };
};
