import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment
} from '../../utils';

export default node => {
    return {
        tabName: node.getAttribute('data-tab-name'),
        minHeight: node.style.minHeight,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node)
    };
};
