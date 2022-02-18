import { getAdvanced } from '../../utils';

export default node => {
    const widgetBlock = node.childNodes[0];

    if (
        !widgetBlock ||
        (widgetBlock && !widgetBlock.getAttribute('data-uids'))
    ) {
        return {};
    }

    // dynamicBlock shimmer uses minHeight from closest row
    const row = widgetBlock.closest('[data-content-type="row"]')?.firstChild;

    return {
        minHeight: row && row.style.minHeight ? row.style.minHeight : null,
        displayInline: widgetBlock
            .getAttribute('class')
            .includes('block-banners-inline'),
        displayMode: widgetBlock.getAttribute('data-display-mode'),
        uids: widgetBlock.getAttribute('data-uids'),
        ...getAdvanced(node)
    };
};
